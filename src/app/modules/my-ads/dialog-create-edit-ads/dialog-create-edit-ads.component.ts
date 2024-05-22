import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdsInterface, EditAdsInterface } from "../../../models/ads.interface";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-create-edit-ads',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule],
  templateUrl: './dialog-create-edit-ads.component.html',
  styleUrl: './dialog-create-edit-ads.component.scss'
})
export class DialogCreateEditAdsComponent {


  formAds = this.fb.group({
    title:[ this.data?this.data.title: '', Validators.required],
    description:[ this.data?this.data.description: '', Validators.required],
  })

  selectedFileAdd: any = null;
  srcPreviewAdd: string | ArrayBuffer ='';

  constructor(
    public dialogRef: MatDialogRef<DialogCreateEditAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditAdsInterface,
    private fb:FormBuilder) {}

    registerAds(){
      if(this.formAds.valid){
        if(this.data?.id) {
          let ad = {id: this.data.id,...this.formAds.value};
          this.dialogRef.close({
            data:ad, 
            file: this.selectedFileAdd,
            result: this.srcPreviewAdd});
          return;
        }
        this.dialogRef.close({
          data: this.formAds.value, 
          file:this.selectedFileAdd,
          resust: this.srcPreviewAdd});
      }
      return
    }

    onFileSelectedAdd(event: any) {
      if(!event){
        return
      }
      this.selectedFileAdd = event.target.files[0] ?? null;
      const reader = new FileReader();
      reader.onloadend = ()=> {
        this.srcPreviewAdd = reader.result?? ''
      }
      reader.readAsDataURL(this.selectedFileAdd);
      return reader;
    }
}

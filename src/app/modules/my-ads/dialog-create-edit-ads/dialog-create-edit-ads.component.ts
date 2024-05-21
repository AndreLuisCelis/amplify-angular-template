import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdsInterface } from '../../../models/ads.interface';

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
    MatInputModule],
  templateUrl: './dialog-create-edit-ads.component.html',
  styleUrl: './dialog-create-edit-ads.component.scss'
})
export class DialogCreateEditAdsComponent {


  formAds = this.fb.group({
    title:[ this.data?this.data.title: '', Validators.required],
    description:[ this.data?this.data.description: '', Validators.required],
    id:[ this.data?this.data.id: 'teste']
  })

  constructor(
    public dialogRef: MatDialogRef<DialogCreateEditAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdsInterface,
    private fb:FormBuilder) {}

    registerAds(){
      console.log(this.formAds.valid)
      if(this.formAds.valid){
        this.dialogRef.close(this.formAds.value)
      }
      return
    }
}

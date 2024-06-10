import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EditAdsInterface } from "../../../models/ads.interface";
import { CommonModule } from '@angular/common';
import { PayloadCreateAds } from '../../../models/payload-creatads.interface';



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

  selectedFileAdd: any = null;
  srcPreviewAdd: string | ArrayBuffer = this.urlImg;
  arrayBufferForData: string | ArrayBuffer = '';

  formAds = this.fb.group({
    title: [this.data ? this.data.title : '', Validators.required],
    description: [this.data ? this.data.description : '', Validators.required],
    srcPreviewAdd: [this.srcPreviewAdd, Validators.required],
  })

  constructor(
    public dialogRef: MatDialogRef<DialogCreateEditAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditAdsInterface,
    private fb: FormBuilder) { }

  registerAds() {
    this.formAds.controls['srcPreviewAdd'].markAsTouched();
    if (this.formAds.valid) {
      let payload: PayloadCreateAds = {
        fileName: this.selectedFileAdd?.name,
        data: this.formAds.value as EditAdsInterface,
        imgBase64: this.srcPreviewAdd,
        result: this.arrayBufferForData
      }
      if (this.data?.id) {
        let ad = { id: this.data.id, ...this.formAds.value };
        payload.data = ad as EditAdsInterface;
        this.dialogRef.close(payload);
        return;
      }
      this.dialogRef.close(payload);
      return;
    }
  }
  get urlImg(){
    return this.data.srcPublicImage? this.data.srcPublicImage:
    this.data.srcImageExpire? this.data.srcImageExpire: '';
  }

  onFileSelectedAdd(event: any) {
    if (!event) {
      return
    }
    this.selectedFileAdd = event.target.files[0] ?? null;
    this.getResulForSrcPreviewImg(this.selectedFileAdd);
    this.getResulForArrayBufferData(this.selectedFileAdd);
  }

  getResulForSrcPreviewImg(selectedFile: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.srcPreviewAdd = reader.result ?? ''
      this.formAds.controls['srcPreviewAdd'].setValue(this.srcPreviewAdd)
    }
    reader.readAsDataURL(selectedFile);
  }

  getResulForArrayBufferData(selectedFile: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.arrayBufferForData = reader.result ?? ''
    }
    reader.readAsArrayBuffer(selectedFile);
  }
}

import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PayloadCreateAds } from '../../../models/payload-creatads.interface';
import { By } from '@angular/platform-browser';

describe('DialogCreateEditAdsComponent', () => {
  let component: DialogCreateEditAdsComponent;
  let fixture: ComponentFixture<DialogCreateEditAdsComponent>;
  let matDialogRef : MatDialogRef<DialogCreateEditAdsComponent>;
  let payload: PayloadCreateAds


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCreateEditAdsComponent,
        MatDialogContent,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers:[
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {}},
        { provide: ComponentFixtureAutoDetect, useValue: true}
      ]
    })
    .compileComponents();
     payload = {
      data: {
        description: 'teste',
        id: 'teste',
        title: 'Teste'
      },
      fileName: 'teste',
      imgBase64: '',
      result: ''
    }
    fixture = TestBed.createComponent(DialogCreateEditAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide details of the new ad title', ()=> {
  component.formAds.controls['title'].setValue('Title teste');
  fixture.detectChanges();
  let inputTitle: HTMLInputElement = fixture.debugElement.query(By.css("#titleAds")).nativeElement;
  expect(component.formAds.controls['title'].value).toEqual(inputTitle.value);
  })

  it('should provide details of the new ad title input ', ()=> {
    let inputTitle: HTMLInputElement = fixture.debugElement.query(By.css("#titleAds")).nativeElement;
    inputTitle.value = 'New Title';
    inputTitle.dispatchEvent(new Event('input'))
    expect(component.formAds.controls['title'].value).toEqual(inputTitle.value);
    })

  it('should provide details of the new ad description', ()=> {
    component.formAds.controls['description'].setValue('Description teste');
    fixture.detectChanges();
    let inputDescription: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector('#descriptionAds');
    expect(component.formAds.controls['description'].value).toEqual(inputDescription.value)
    })

  it('should contain the title of the payload passed', ()=> {
    component.formAds.patchValue(payload.data);
    let inputTitle = fixture.debugElement.query(By.css('#titleAds'))?.nativeElement;
    expect(inputTitle?.value).toEqual(payload.data.title);
   });

  it('should provide details of the edit ad', ()=> {
    component.data = payload.data
    component.formAds.patchValue(payload.data);
    component.formAds.controls.srcPreviewAdd.setValue('Teste');
    component.registerAds();
    expect(component.formAds.valid).toBeTruthy()
   })

   it('should onloadFile', async ()=> {
    const obj = { hello: "world" };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
});
    let event = {
      target: {
        files: [blob]
      }
    }
    component.onFileSelectedAdd(event)
    await component.selectedFileAdd.text();
    expect(component.srcPreviewAdd.toString()).toBeTruthy()
   })

   it('should contain the title null for payload void', ()=> {
    payload.data.id ='';
    component.data = payload.data;
    component.formAds.patchValue(payload.data);
    component.formAds.controls.srcPreviewAdd.setValue('Teste');
    component.registerAds();
    component.formAds.reset();
    component.registerAds();
    fixture.detectChanges();
    
    expect(component.formAds.controls['title'].value).toEqual(null);
   });

   it('should provide srcPublicImage', ()=> {
    payload.data.srcPublicImage = 'teste public'
    component.data = payload.data
    expect(component.urlImg).toEqual('teste public')
   })

   it('should provide srcImageExpire', ()=> {
    payload.data.srcImageExpire = 'teste expire'
    component.data = payload.data
    expect(component.urlImg).toEqual('teste expire')
   })
});

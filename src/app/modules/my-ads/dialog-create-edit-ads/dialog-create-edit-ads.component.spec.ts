import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogCreateEditAdsComponent', () => {
  let component: DialogCreateEditAdsComponent;
  let fixture: ComponentFixture<DialogCreateEditAdsComponent>;
  let matDialogRef : MatDialogRef<DialogCreateEditAdsComponent>;


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
        { provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCreateEditAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

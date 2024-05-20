import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads.component';

describe('DialogCreateEditAdsComponent', () => {
  let component: DialogCreateEditAdsComponent;
  let fixture: ComponentFixture<DialogCreateEditAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateEditAdsComponent]
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

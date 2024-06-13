import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdsComponent } from './my-ads.component';
import { AdsService } from '../ads.service';
import { mockAds, payloadMock } from '../ads.service.spec';
import { of } from 'rxjs';
import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads/dialog-create-edit-ads.component';

describe('MyAdsComponent', () => {
  let component: MyAdsComponent;
  let fixture: ComponentFixture<MyAdsComponent>;
  let adsService: AdsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAdsComponent,  DialogCreateEditAdsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAdsComponent);
    component = fixture.componentInstance;
    adsService = TestBed.inject(AdsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getMyAds', () => {
    let getMyAds = spyOn(adsService , 'getMyAds').and.returnValue(of(mockAds));
    component.getMyAds();
    expect(getMyAds).toHaveBeenCalledTimes(1);
  });

  it('should creatads', () => {
    let creatads = spyOn(adsService , 'createAds').and.returnValue(of(mockAds[0]));
    component.createAds(payloadMock);
    expect(creatads).toHaveBeenCalledTimes(1);
  });

  it('should updateAds', () => {
    let updateAds = spyOn(adsService , 'updateAds').and.returnValue(of(mockAds[0]));
    component.updateAds(payloadMock);
    expect(updateAds).toHaveBeenCalledTimes(1);
  });

  it('should deleteAds', () => {
    spyOn(adsService , 'getMyAds').and.returnValue(of(mockAds));
    let deleteAds = spyOn(adsService , 'deleteAds').and.returnValue(of(mockAds[0]));
    component.getMyAds();
    component.deleteAds(mockAds[0].id);
    expect(deleteAds).toHaveBeenCalledTimes(1);
  });

  it('should openModalCreatAd', () => {
    let dialog = spyOn(component.dialog, 'open');
    component.openModalCreateAd();
    expect(dialog).toHaveBeenCalledTimes(1);
  });

  it('should openModalUpdateAd', () => {
    let dialog = spyOn(component.dialog, 'open');
    component.openModalUpdateAd(mockAds[0]);
    expect(dialog).toHaveBeenCalledTimes(1);
  });

  it('should openModalUpdateAd and return payload', async () => {
    let spyDialog = spyOn(component.dialog,'open')
    let dialog =  component.openModalUpdateAd(mockAds[0]);
    dialog?.close(payloadMock);
    expect(spyDialog).toHaveBeenCalledTimes(1);
  });
});

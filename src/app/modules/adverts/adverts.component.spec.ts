import { ComponentFixture, TestBed } from '@angular/core/testing';
import outputs from '../../../../amplify_outputs.json';
import { AdvertsComponent } from './adverts.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService, client } from '../ads.service';
import { Amplify } from 'aws-amplify';
import { of } from 'rxjs';
import { mockAds } from '../ads.service.spec';

describe('AdvertsComponent', () => {
  let component: AdvertsComponent;
  let fixture: ComponentFixture<AdvertsComponent>;
  let spinner: NgxSpinnerService;
  let adsService: AdsService;
  client 
  Amplify.configure(outputs);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvertsComponent);
    component = fixture.componentInstance;
    adsService = TestBed.inject(AdsService);
    spinner = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should List Ads', done => {
    spyOn( adsService, 'getListAds').and.returnValue(of(mockAds));
    component.listAds().subscribe( res => {
      expect(res[0].id).toEqual(mockAds[0].id);
      done();
    })
  });
});

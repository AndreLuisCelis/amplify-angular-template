import { TestBed } from '@angular/core/testing';
import { AdsService, client } from './ads.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { EditAdsInterface } from '../models/ads.interface';

const mockAds = [
  {
    id: "1",
    title: "Anuncio 1",
    description: "Teste de anuncio",
    images: [
      "picture-submissions/32(12).png--"
    ],
    srcImageExpire: null,
    srcPublicImage: null,
    createdAt: "2024-06-04T01:44:24.635Z",
    updatedAt: "2024-06-04T01:44:24.635Z",
    owner: "6448c4a8-9041-709d-c9bd-7c3a0e05b9d3"
  },
  {
    id: "2",
    title: "Anuncio 2",
    description: "Teste de anuncio",
    images: [
      "picture-submissions/32(12).png--"
    ],
    srcImageExpire: null,
    srcPublicImage: null,
    createdAt: "2024-06-04T03:44:24.635Z",
    updatedAt: "2024-06-04T01:44:24.635Z",
    owner: "6448c4a8-9041-709d-c9bd-7c3a0e05b9d3"
  }
]

const payloadMock =  {
  fileName: 'Teste',
  data: {
    id: '1',
    title: "Anuncio 2",
    description: "Teste de anuncio",
  },
  imgBase64: 'string | ArrayBuffer',
  result: 'string | ArrayBuffer'
}


describe('AdsService', () => {
  let service: AdsService;
  let httpTestingController: HttpTestingController;
  client 
  Amplify.configure(outputs);
  let authenticator: AuthenticatorService;
  let spyLisMyAds: jasmine.Spy;
  let spyGetUrlImage: jasmine.Spy;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });

    service = TestBed.inject(AdsService);
    httpTestingController = TestBed.inject(HttpTestingController)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    authenticator = TestBed.inject(AuthenticatorService);

    spyLisMyAds = spyOn(service , 'lisMyAds').and.returnValue(of(mockAds));
    spyGetUrlImage = spyOn(service, 'getUrlImage').and.callThrough();

    spyOn(service , 'getListAds').and.returnValue(of(mockAds));
    spyOn(service , 'getMyAds').and.returnValue(of(mockAds));
    spyOn(service, 'newAds').and.returnValue(Promise.resolve(mockAds[0]));
    spyOn(service, 'editAds').and.returnValue(Promise.resolve(mockAds[1]))
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list of ads', done => {
    service.getListAds().subscribe( res => {
      expect(res).toBe(mockAds);
      done();
    })
  });

  it('should get list of myAds', done => {
    service.getMyAds().subscribe( res => {
      expect(res).toBe(mockAds);
      done();
    })
  });

  it('should orde by desc list myAds', () => {
    service.orderDesc(mockAds);
    expect(mockAds[0].id).toEqual('2')
  });

  it('should get imgs of list myAds', () => {
    service.getUrlImagesAds(mockAds);
    expect(mockAds[0].images[0]).toEqual('picture-submissions/32(12).png--')
  });

  it('should create Ads', done => {
    service.createAds(payloadMock).subscribe( (res) => {
      expect(res).toEqual(mockAds[0])
      done()
    })
  });

  it('should update Ads', done => {
    service.updateAds(payloadMock).subscribe( (res) => {
      expect(res).toEqual(mockAds[1])
      done()
    })
  });

  it('should to calls getMyAds request', done => {
    service.lisMyAds().subscribe(res => {
      expect(res).toContain(mockAds[0] as EditAdsInterface)
      expect(spyLisMyAds).toHaveBeenCalledTimes(1)
      done();
    });
  });
});

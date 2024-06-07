import { TestBed, fakeAsync } from '@angular/core/testing';

import { AdsService, client } from './ads.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getUrl, uploadData } from 'aws-amplify/storage';

const mockAds = [
  {
    id: "1",
    title: "Anuncio 1",
    description: "Teste de anuncio",
    images: [
      "picture-submissions/32(12).png"
    ],
    srcImageExpire: "https://amplify-d1i7n24tkfv9cw-ma-amplifyteamdrivebucket28-xuviy5jfvgzt.s3.us-east-1.amazonaws.com/picture-submissions/32%2812%29.png?x-amz-content-sha256",
    srcPublicImage: "https://amplify-d1i7n24tkfv9cw-ma-amplifyteamdrivebucket28-xuviy5jfvgzt.s3.us-east-1.amazonaws.com/picture-submissions/32%2812%29.png",
    createdAt: "2024-06-04T01:44:24.635Z",
    updatedAt: "2024-06-04T01:44:24.635Z",
    owner: "6448c4a8-9041-709d-c9bd-7c3a0e05b9d3"
  },
  {
    id: "2",
    title: "Anuncio 2",
    description: "Teste de anuncio",
    images: [
      "picture-submissions/32(12).png"
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
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(AdsService);
    httpTestingController = TestBed.inject(HttpTestingController)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    authenticator = TestBed.inject(AuthenticatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list of ads', () => {
    spyOn(service , 'getListAds').and.returnValue(of(mockAds))
    service.getListAds().subscribe( res => {
      expect(res).toBe(mockAds);
    })
  });

  it('should return an error message in get list ads', done => {
    let spied = spyOn(service , 'getListAds').and.callThrough();
    service.getListAds().subscribe( res => {
      let erro:any = res
      expect(erro.message).toEqual('error fetching Ads');
    })
    expect(spied).toHaveBeenCalledTimes(1);
    done();
  });

  it('should get list of myAds', () => {
    spyOn(service , 'getMyAds').and.returnValue(of(mockAds))
    service.getMyAds().subscribe( res => {
      expect(res).toBe(mockAds);
    })
  });

  it('should return a message error in get list myAds', done => {
    let spied = spyOn(service , 'getMyAds').and.callThrough();
    service.getMyAds().subscribe( res => {
      let erro:any = res
      console.log('res mydas', res)
      expect(erro.message).toEqual('error fetching myAds');
    })
    expect(spied).toHaveBeenCalledTimes(1);
    done();
  });

  it('should orde by desc list myAds', () => {
    service.orderDesc(mockAds);
    expect(mockAds[0].id).toEqual('2')
  });

  it('should get imgs of list myAds', () => {
    service.getUrlImagesAds(mockAds);
    expect(mockAds[0].images[0]).toEqual('picture-submissions/32(12).png')
  });

  it('should create Ads', done => {
    let res = (resolve:any)=> {
      resolve(mockAds[0])
    }
    spyOn(service, 'newAds').and.returnValue(new Promise(res))
    service.createAds(payloadMock).subscribe( (res) => {
      expect(res).toEqual(mockAds[0])
      done()
    })
  });

  it('should update Ads', done => {
    let res = (resolve:any)=> {
      resolve(mockAds[1])
    }
    spyOn(service, 'editAds').and.returnValue(new Promise(res))
    service.updateAds(payloadMock).subscribe( (res) => {
      expect(res).toEqual(mockAds[1])
      done()
    })
  });

  it('should to calls getMyAds request',done => {
    let spyCallClientListMyAds =  spyOn(client.models.Ads, 'listMyAds').and.returnValue(Promise.resolve(mockAds))
    let spyCallClientGetUrl = spyOn(service, 'storageFunctionGetUrl').and.returnValue(Promise.resolve({url:'' as any, expiresAt: '' as any}))
    let spyCallClientUploadData = spyOn(service, 'storageFunctionUploadData').and.returnValue({path:''} as any)
  
    service.getMyAds().subscribe(res => {console.log('res---->', res); done()});
     expect(spyCallClientListMyAds).toHaveBeenCalledTimes(1)
     expect(spyCallClientGetUrl).toHaveBeenCalledTimes(0)
     expect(spyCallClientUploadData).toHaveBeenCalledTimes(0)
  });
});

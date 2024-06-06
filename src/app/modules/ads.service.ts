import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Observable, from, map, of } from 'rxjs';
import { AdsInterface, EditAdsInterface } from '../models/ads.interface';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { PayloadCreateAds } from '../models/payload-creatads.interface';


const client = generateClient<Schema>();

@Injectable({
  providedIn: 'root'
})
export class AdsService {

   

  constructor(
    private authenticator: AuthenticatorService
  ) { }

  getListAds(): Observable<EditAdsInterface[]> {
    try {
      return client.models.Ads.observeQuery().pipe(
        map(({ items, isSynced }) => {
          this.getUrlImagesAds(items as EditAdsInterface[]);
          return items as EditAdsInterface[];
        })
      )
    } catch (error) {
      console.error('error fetching myAds', error);
      let erro: any = new Error('error fetching Ads')
      return of(erro)
    }
  }

  getMyAds(): Observable<EditAdsInterface[]> {
    try {
      /// Teste lisMyAds
     return from(client.models.Ads.listMyAds({
        userId: this.authenticator.user.userId,
      })).pipe(
        map((items) => {
          this.orderDesc(items.data as EditAdsInterface[]);
          this.getUrlImagesAds(items.data as EditAdsInterface[]);
          return items.data as EditAdsInterface[];
        })
      )
    
      // return from(client.models.Ads.observeQuery({
      //   filter:{
      //     owner: {
      //       contains: this.authenticator.user.userId
      //     }
      //   }
      // })).pipe(
      //   map(({ items, isSynced }) => {
      //     this.orderDesc(items as EditAdsInterface[]);
      //     this.getUrlImagesAds(items as EditAdsInterface[]);
      //     return items as EditAdsInterface[];
      //   })
      // )
    } catch (error) {
      console.error('error fetching myAds', error);
      let erro: any = new Error('error fetching myAds')
      return of(erro)
    }
  }

  orderDesc(myAds: EditAdsInterface[]) {
    for (let i = 0; i < myAds.length; i++) {
      for (let j = 0; j < myAds.length; j++) {
        if (j >= myAds.length) {
          return;
        }
        let indicePrimeiroItem = j;
        let indiceSegundoItem = j + 1;
        const dateA = new Date(myAds[indicePrimeiroItem]?.createdAt as string).valueOf();
        const dateB = new Date(myAds[indiceSegundoItem]?.createdAt as string).valueOf();

        if (dateA < dateB) {
          let cretedAtMenor = myAds[indicePrimeiroItem];
          myAds[indicePrimeiroItem] = myAds[indiceSegundoItem];
          myAds[indiceSegundoItem] = cretedAtMenor
        }
      }
    }
    return myAds;
  }

  getUrlImagesAds(ads: EditAdsInterface[]): void {
    ads.map(async (ad: EditAdsInterface, index) => {
      const imgForTestUrl = new Image();
      imgForTestUrl.src = ad.srcPublicImage ?? '';

      imgForTestUrl.onerror = () => {
        console.log('erro in loading image by srcPublicImage');
        ad.srcPublicImage = null;
        ads[index] = ad;

        imgForTestUrl.src = ad.srcImageExpire ?? '';
        imgForTestUrl.onerror = async () => {
          console.log('erro in loading image by srcImageExpire');
          ads[index] = ad;
          await this.getUrlImage(ad);
          ad.srcPublicImage = null;
          ads[index] = ad;
        }
      };
    })
  }

  async getUrlImage(ads: EditAdsInterface | AdsInterface) {
    try {
      let urlOutput = await getUrl({
        path: ads.images[0],
        options: {
          validateObjectExistence: false,  // defaults to false
          expiresIn: 5, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
        }
      })
      ads.srcImageExpire = urlOutput.url.toString();
      ads.srcPublicImage = urlOutput.url.origin + urlOutput.url.pathname;

    } catch (error) {
      console.error('error fetching urlImage', error);
    }
  }

  createAds(payload: PayloadCreateAds): Observable<AdsInterface> {
    const creatAdObs = from(this.newAds(payload));
    return creatAdObs;
  }

  updateAds(payload: PayloadCreateAds): Observable<EditAdsInterface> {
    const creatAdObs = from(this.editAds(payload));
    return creatAdObs;
  }

  async newAds(payload: PayloadCreateAds): Promise<AdsInterface> {
    let path = '';
    try {
      await uploadData({
        data: payload.result,
        path: `picture-submissions/${payload.fileName}`
      }).result.then(res => {
        path = res.path;
      });
    } catch (e) {
      console.log("error", e);
    }
    let ad: AdsInterface = {
      title: payload.data.title, 
      description: payload.data.description, 
      images: [path],
      userId:this.authenticator.user.userId,
      user: {
        id: this.authenticator.user.userId,
        name: this.authenticator.username,
        email: this.authenticator.user.signInDetails?.loginId
      }
    }
    await this.getUrlImage(ad);
    let response = await client.models.Ads.create(ad);
    let newAds: AdsInterface = response.data as AdsInterface;
    return newAds;
  }

  async editAds(payload: PayloadCreateAds): Promise<EditAdsInterface> {
    let path = '';
    try {
      await uploadData({
        data: payload.result,
        path: `picture-submissions/${payload.fileName}`
      }).result.then(res => {
        path = res.path;
      });
    } catch (e) {
      console.log("error", e);
    }
    let adForEdit: EditAdsInterface = {
      id: payload.data.id,
      title: payload.data.title,
      description: payload.data.description,
      images: [path]
    }
      await this.getUrlImage(adForEdit);
      let response = await client.models.Ads.update(adForEdit);
      let editedAds: EditAdsInterface = response.data as EditAdsInterface;
      return editedAds;
  }
}
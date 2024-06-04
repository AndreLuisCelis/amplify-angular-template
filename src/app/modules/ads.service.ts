import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Observable, from, map, of } from 'rxjs';
import { AdsInterface, EditAdsInterface } from '../models/ads.interface';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { PayloadCreateAds } from './my-ads/dialog-create-edit-ads/dialog-create-edit-ads.component';

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
          let itemsList: EditAdsInterface[] = items;
          this.getUrlImagesAds(itemsList);
          return itemsList
        })
      )
    } catch (error) {
      console.error('error fetching myAds', error);
      let erro: EditAdsInterface[] = [];
      return of(erro)
    }
  }

  getMyAds(): Observable<EditAdsInterface[]> {
    try {
      return client.models.Ads.observeQuery().pipe(
        map(({ items, isSynced }) => {
          let itemsList: EditAdsInterface[] = items.filter(ad => {
            return ad.owner === this.authenticator.user.userId
          })
          this.orderDesc(itemsList);
          this.getUrlImagesAds(itemsList);
          
          // this.orderByDesc(itemsList);
          return itemsList
        })
      )
    } catch (error) {
      console.error('error fetching myAds', error);
      let erro: EditAdsInterface[] = [];
      return of(erro)
    }
  }

  private orderByDesc(myAds: EditAdsInterface[]) {
    myAds = myAds.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).valueOf();
      const dateB = new Date(b.createdAt).valueOf();
      return dateA > dateB ? 1 : dateB > dateA ? -1 : 0;
    })
  }

  private orderDesc(myAds: EditAdsInterface[]){
    for (let i = 0; i < myAds.length; i++) {
      for (let j = 0; j < myAds.length; j++) {
        if(j >= myAds.length){
          return;
        }
        let indicePrimeiroItem = j;
        let indiceSegundoItem = j+1;
        const dateA = new Date(myAds[indicePrimeiroItem]?.createdAt as string).valueOf();
        const dateB = new Date(myAds[indiceSegundoItem]?.createdAt as string).valueOf();

        if(dateA < dateB){
          let cretedAtMenor = myAds[indicePrimeiroItem];
          myAds[indicePrimeiroItem] = myAds[indiceSegundoItem];
          myAds[indiceSegundoItem] = cretedAtMenor
        }
      }
    }
    return myAds;
  }

  private getUrlImagesAds(ads: EditAdsInterface[]): void {
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

  createAds(payload: PayloadCreateAds): Observable<any> {
    const creatAdObs = from(this.createOrUpdateAds(payload));
    return creatAdObs;
  }

  updateAds(payload: PayloadCreateAds): Observable<any> {
    const creatAdObs = from(this.createOrUpdateAds(payload));
    return creatAdObs;
  }

  async createOrUpdateAds(payload: PayloadCreateAds) {
    let path = '';
    try {
      await uploadData({
        data: payload.result,
        path: `picture-submissions/${payload.fileName}`
      }).result.then(resultado => {
        console.log('UPULOAD RES--->', resultado)
        path = resultado.path;
      });
    } catch (e) {
      console.log("error", e);
    }
    let ad: AdsInterface = {
      title: payload.data.title,
      description: payload.data.description,
      images: [path]
    }

    if (payload.data.id) {
      let adForEdit: EditAdsInterface = { ...ad, id: payload.data.id }
      await this.getUrlImage(adForEdit);
      client.models.Ads.update(adForEdit);
    } else {
      await this.getUrlImage(ad);
      client.models.Ads.create(ad);
    }
  }
}
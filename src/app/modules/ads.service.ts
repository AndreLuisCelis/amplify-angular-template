import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Observable, from, map, of } from 'rxjs';
import { AdsInterface, EditAdsInterface } from '../models/ads.interface';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { PayloadCreateAds } from '../models/payload-creatads.interface';



export const client = generateClient<Schema>();

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  storageFunctionGetUrl = getUrl;
  storageFunctionUploadData = uploadData;
  apiListAds = client.models.Ads.listMyAds({
    userId: this.authenticator?.user?.userId?this.authenticator?.user?.userId: ''
  })

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
      return this.lisMyAds().pipe(
        map((items: EditAdsInterface[]) => {
          this.orderDesc(items);
          console.log('--->', items)
          items = this.getUrlImagesAds(items);
          return items;
        })
      )
    } catch (error) {
      console.error('error fetching myAds', error);
      let erro: any = new Error('error fetching myAds')
      return of(erro)
    }
  }

  lisMyAds(): Observable<EditAdsInterface[]>{
    return from(client.models.Ads.listMyAds({
      userId: this.authenticator?.user?.userId?this.authenticator?.user?.userId: ''
    }).then(items=>{
      return items.data as EditAdsInterface[]
    }  )) 
  }

  orderDesc(myAds: EditAdsInterface[]) {
    for (let i = 0; i < myAds?.length; i++) {
      for (let j = 0; j < myAds?.length; j++) {
        if (j >= myAds?.length) {
          return;
        }
        let indexFirstItem = j;
        let indexSecondItem = j + 1;
        const dateA = new Date(myAds[indexFirstItem]?.createdAt as string).valueOf();
        const dateB = new Date(myAds[indexSecondItem]?.createdAt as string).valueOf();

        if (dateA < dateB) {
          this.reversePosition(myAds, indexFirstItem, indexSecondItem);
        }
      }
    }
    return myAds;
  }

  private reversePosition( myAds: EditAdsInterface[],indexFirstItem: number, indexSecondItem: number){
    let copyFirstItem = myAds[indexFirstItem];
    myAds[indexFirstItem] = myAds[indexSecondItem];
    myAds[indexSecondItem] = copyFirstItem;
 
  }
  getUrlImagesAds(ads: EditAdsInterface[]): EditAdsInterface[] {
    ads?.map(async (ad: EditAdsInterface, index) => {
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
    return ads;
  }

  async getUrlImage(ads: EditAdsInterface | AdsInterface) {
    try {
      let urlOutput = await this.storageFunctionGetUrl({
        path: ads.images[0],
        options: {
          validateObjectExistence: false,  // defaults to false
          expiresIn: 5, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
        }
      })
      ads.srcImageExpire = urlOutput?.url.toString();
      ads.srcPublicImage = urlOutput?.url.origin + urlOutput.url.pathname;

    } catch (error) {
      console.error('error fetching urlImage', error);
    }
    return ads
  }

  createAds(payload: PayloadCreateAds): Observable<AdsInterface> {
    const creatAdObs = from(this.newAds(payload));
    return creatAdObs;
  }

  updateAds(payload: PayloadCreateAds): Observable<EditAdsInterface> {
    const creatAdObs = from(this.editAds(payload));
    return creatAdObs;
  }

  deleteAds(id: string): Observable<EditAdsInterface> {
    const creatAdObs = from(this.removeAds(id));
    return creatAdObs ;
  }

  async removeAds(id: string) : Promise<EditAdsInterface>{
    let response = await client.models.Ads.delete({ id });
    let removedAds = response.data as EditAdsInterface
    return removedAds;
  }

  async newAds(payload: PayloadCreateAds): Promise<AdsInterface> {
    let path = '';
    try {
      await this.storageFunctionUploadData({
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
      if(payload.result) { // Verify if img was modified 
        await this.storageFunctionUploadData({
          data: payload.result,
          path: `picture-submissions/${payload.fileName}`
        }).result.then(res => {
          path = res.path;
        });
      } 
    } catch (e) {
      console.log("error", e);
    }
    let adForEdit: EditAdsInterface = {
      id: payload.data.id,
      title: payload.data.title,
      description: payload.data.description,
    }
    // VERIFY CHANGE OF IMG FOR GET NEW URL
    if(payload.result) {
      adForEdit.images = [path];
      await this.getUrlImage(adForEdit);
    }
      let response = await client.models.Ads.update(adForEdit);
      let editedAds: EditAdsInterface = response.data as EditAdsInterface;
      return editedAds;
  }
}
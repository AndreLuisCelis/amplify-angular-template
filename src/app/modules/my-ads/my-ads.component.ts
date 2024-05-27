import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditAdsInterface } from '../../models/ads.interface';
import { AdsInterface } from "../../models/ads.interface";
import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads/dialog-create-edit-ads.component';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { uploadData } from "aws-amplify/storage";
import { getUrl } from 'aws-amplify/storage';
import { aws_location } from 'aws-cdk-lib';
import { single } from 'rxjs';



const client = generateClient<Schema>();

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.scss'
})
export class MyAdsComponent {

  myAds: EditAdsInterface[] = [];
  srcTesteImg = '';

  constructor(
    public dialog: MatDialog,
    private authenticator: AuthenticatorService,
  ) { }

  ngOnInit() {
    this.listMyAds();
  }

  listMyAds() {
    this.getMyAds();
  }
  
  getMyAds(): void {
    try {
      client.models.Ads.observeQuery().subscribe({
        next: async ({ items, isSynced }) => {
          this.myAds = items.filter(adFilterUser => {
            return adFilterUser.owner === this.authenticator.user.userId
          });
          this.getUrlImagesMyAds();
        }
      });
    } catch (error) {
      console.error('error fetching myAds', error);
    }
  }

  getUrlImagesMyAds(): void {
    this.myAds.map(async (adMapForAddSrcImage: EditAdsInterface, index) => {
      const imgForTestUrl = new Image();
      imgForTestUrl.src = adMapForAddSrcImage.srcPublicImage?? '';

      imgForTestUrl.onerror = ()=> {
       console.log('erro in loading image by srcPublicImage');
       adMapForAddSrcImage.srcPublicImage = null;
       this.myAds[index] = adMapForAddSrcImage;

       imgForTestUrl.src = adMapForAddSrcImage.srcImageExpire?? '';
       imgForTestUrl.onerror = async () =>{
        console.log('erro in loading image by srcImageExpire');
        this.myAds[index] = adMapForAddSrcImage;

        await this.getUrlImage(adMapForAddSrcImage);
        adMapForAddSrcImage.srcPublicImage = null;
        this.myAds[index] = adMapForAddSrcImage;
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

  createAd(ad: AdsInterface) {
    try {
      client.models.Ads.create(ad);
      this.listMyAds();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  updateAd(ad: EditAdsInterface) {
    try {
      if (ad.id) {
        client.models.Ads.update(ad);
        this.listMyAds();
      }
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  openModalCreateAd() {
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth: '100%',
    })
      .afterClosed().subscribe({
        next: async (res) => {
          if (res) {
            let path = '';
            try {
              await uploadData({
                data: res.result,
                path: `picture-submissions/${res.file.name}`
              }).result.then(resultado => {
                console.log('UPULOAD RES--->', resultado)
                path = resultado.path;
              });
            } catch (e) {
              console.log("error", e);
            }
            let ad: AdsInterface = {
              title: res.data.title,
              description: res.data.description,
              images: [path]
            }
            await this.getUrlImage(ad)
            this.createAd(ad)
          }
        }
      })
  }

  openModalUpdateAd(ad: EditAdsInterface) {
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth: '100%',
      data: ad
    })
      .afterClosed().subscribe({
        next: async (adRes) => {
          if (adRes) {
            let path = '';
            try {
              await uploadData({
                data: adRes.result,
                path: `picture-submissions/${adRes.file.name}`
              }).result.then(resultado => {
                path = resultado.path;
              });
            } catch (e) {
              console.log("error", e);
            }
            let ad: EditAdsInterface = {
              id: adRes.data.id,
              title: adRes.data.title,
              description: adRes.data.description,
              images: [path]
            }
            await this.getUrlImage(ad)
            this.updateAd(ad)
          }
        }
      })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }
}

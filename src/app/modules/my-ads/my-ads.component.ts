import { Component, Inject, inject } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, first, single, take } from 'rxjs';




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

  spinner = inject(NgxSpinnerService)
  

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
    this.spinner.show();
    try {
      client.models.Ads.observeQuery()
      .subscribe({
        next: async ({ items, isSynced }) => {
          this.myAds = items.filter(adFilterUser => {
            return adFilterUser.owner === this.authenticator.user.userId
          });
          this.spinner.hide();
          this.orderByDesc(this.myAds);
          this.getUrlImagesMyAds();
        }
      });
    } catch (error) {
      this.spinner.hide();
      console.error('error fetching myAds', error);
    }
  }

  orderByDesc( myAds: EditAdsInterface[] ){
    this.spinner.show();
    myAds.sort((a:any, b:any) => {
      return  a.createdAt + b.createdAt })
      this.spinner.hide();
  }

  getUrlImagesMyAds(): void {
    this.spinner.show();
    this.myAds.map(async (adMapForAddSrcImage: EditAdsInterface, index) => {
      const imgForTestUrl = new Image();
      imgForTestUrl.src = adMapForAddSrcImage.srcPublicImage?? '';

      imgForTestUrl.onerror = ()=> {
        this.spinner.hide();
       console.log('erro in loading image by srcPublicImage');
       adMapForAddSrcImage.srcPublicImage = null;
       this.myAds[index] = adMapForAddSrcImage;

       imgForTestUrl.src = adMapForAddSrcImage.srcImageExpire?? '';
       imgForTestUrl.onerror = async () =>{
        console.log('erro in loading image by srcImageExpire');
        this.myAds[index] = adMapForAddSrcImage;
        this.spinner.hide();
        await this.getUrlImage(adMapForAddSrcImage);
        adMapForAddSrcImage.srcPublicImage = null;
        this.myAds[index] = adMapForAddSrcImage;
       }
      };    
    })
    this.spinner.hide();
  }

  async getUrlImage(ads: EditAdsInterface | AdsInterface) {
    this.spinner.show();
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
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
      console.error('error fetching urlImage', error);
    }
  }

  createAd(ad: AdsInterface) {
    this.spinner.show();
    try {
      client.models.Ads.create(ad);
      this.listMyAds();
      this.spinner.hide();
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
              this.spinner.show();
              await uploadData({
                data: res.result,
                path: `picture-submissions/${res.file.name}`
              }).result.then(resultado => {
                console.log('UPULOAD RES--->', resultado)
                path = resultado.path;
                this.spinner.hide();
              });
            } catch (e) {
              this.spinner.hide();
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
              this.spinner.show();
              await uploadData({
                data: adRes.result,
                path: `picture-submissions/${adRes.file.name}`
              }).result.then(resultado => {
                path = resultado.path;
                this.spinner.hide();
              });
            } catch (e) {
              this.spinner.hide();
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

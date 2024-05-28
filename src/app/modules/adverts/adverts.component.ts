import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface, EditAdsInterface } from "../../models/ads.interface";
import { getUrl } from 'aws-amplify/storage';
import { NgxSpinnerService } from 'ngx-spinner';

const client = generateClient<Schema>();

@Component({
  selector: 'app-adverts',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule],
  templateUrl: './adverts.component.html',
  styleUrl: './adverts.component.scss'
})
export class AdvertsComponent {

  ads: AdsInterface[] = [];

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.listAds()
  }

  listAds() {
    this.spinner.show();
      client.models.Ads.observeQuery().subscribe({
        next: async ({ items, isSynced }) => {
          this.ads = items;
          this.spinner.hide();
          this.getUrlImagesAds();    
        },
      });
  }

  getUrlImagesAds(): void {
    this.spinner.show();
    this.ads.map(async (adMapForAddSrcImage: AdsInterface, index) => {
      const imgForTestUrl = new Image();
      imgForTestUrl.src = adMapForAddSrcImage.srcPublicImage?? '';

      imgForTestUrl.onerror = ()=> {
       console.log('erro in loading image by srcPublicImage');
       adMapForAddSrcImage.srcPublicImage = null;
       this.ads[index] = adMapForAddSrcImage;
       this.spinner.hide();

       imgForTestUrl.src = adMapForAddSrcImage.srcImageExpire?? '';
       imgForTestUrl.onerror = async () =>{
        console.log('erro in loading image by srcImageExpire');
        this.ads[index] = adMapForAddSrcImage;
        this.spinner.hide();
        await this.getUrlImage(adMapForAddSrcImage);
        adMapForAddSrcImage.srcPublicImage = null;
        this.ads[index] = adMapForAddSrcImage;
       }
      };    
    })
    this.spinner.hide();
  }

  async getUrlImage(ads: AdsInterface) {
    try {
      this.spinner.show();
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
}

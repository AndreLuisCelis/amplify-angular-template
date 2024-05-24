import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface } from "../../models/ads.interface";
import { getUrl } from 'aws-amplify/storage';

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

  constructor() { }

  ngOnInit() {
    this.listAds()
  }

  listAds() {
    try {
      client.models.Ads.observeQuery().subscribe({
        next: async ({ items, isSynced }) => {

          this.ads = items;
        
          this.ads.map (async (adMapForAddSrcImage: any, index) => {
            let urlOutput = await getUrl({
              path: adMapForAddSrcImage.images[0],
              options: {
                validateObjectExistence: false,  // defaults to false
                expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
              }
            })
             adMapForAddSrcImage.srcImage = urlOutput.url.toString();
             this.ads[index] = adMapForAddSrcImage;
        });
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }
}

import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads/dialog-create-edit-ads.component';
import { CommonModule } from '@angular/common';
import { AdsInterface } from '../../models/ads.interface';

const client = generateClient<Schema>();

@Component({
  selector: 'app-adverts',
  standalone: true,
  imports: [MatButtonModule , CommonModule, MatCardModule],
  templateUrl: './adverts.component.html',
  styleUrl: './adverts.component.scss'
})
export class AdvertsComponent {

  ads: AdsInterface[] = [];

  constructor(public dialog: MatDialog){}

  ngOnInit(){
    this.listAds()
  }

  listAds() {
    try {
      client.models.Ads.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.ads = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createAd(ad: any) {
    try {
      client.models.Ads.create(ad);
      this.listAds();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  openModalCreateAd(){
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth:'100%',
    })
    .afterClosed().subscribe({
      next: ad=> {
        if(ad){
          this.createAd(ad)
        }
      }
    })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }
}

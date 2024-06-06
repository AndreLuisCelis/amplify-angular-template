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
import { uploadData } from "aws-amplify/storage";
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from '../ads.service';
import { PayloadCreateAds } from '../../models/payload-creatads.interface';

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
    private adsService: AdsService
  ) { }

  ngOnInit() {
    this.getMyAds();
  }

  getMyAds(): void {
    this.spinner.show();
    this.adsService.getMyAds().subscribe({
      next: (items) => {
        this.myAds = items;
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });
  }

 

  createAds(payload: PayloadCreateAds) {
    this.spinner.show();
    this.adsService.createAds(payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.getMyAds();
      }, error: () => this.spinner.hide()
    })
  }

  updateAds(payload: PayloadCreateAds) {
    this.spinner.show();
    this.adsService.updateAds(payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.getMyAds();
      }, error: () => this.spinner.hide()
    })
  }

  updateAd(ad: EditAdsInterface) {
    try {
      if (ad.id) {
        client.models.Ads.update(ad);
        this.getMyAds();
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
        next: async (payload: PayloadCreateAds) => {
          if (payload) {
            this.createAds(payload);
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
        next: async (payload: PayloadCreateAds) => {
          if (payload) {
            this.updateAds(payload)
          }
        }
      })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }
}

import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditAdsInterface } from '../../models/ads.interface';
import { DialogCreateEditAdsComponent } from './dialog-create-edit-ads/dialog-create-edit-ads.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from '../ads.service';
import { PayloadCreateAds } from '../../models/payload-creatads.interface';
import { finalize } from 'rxjs';


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
    this.adsService.getMyAds().pipe(finalize(() => this.spinner.hide()))
      .subscribe({ next: (items) => { this.myAds = items } });
  }

  createAds(payload: PayloadCreateAds) {
    this.spinner.show();
    this.adsService.createAds(payload).pipe(finalize(() => this.spinner.hide()))
      .subscribe({ next: () => this.getMyAds() })
  }

  updateAds(payload: PayloadCreateAds) {
    this.spinner.show();
    this.adsService.updateAds(payload).pipe(finalize(() => this.spinner.hide()))
      .subscribe({ next: () => this.getMyAds() })
  }

  deleteAds(id: string) {
    this.spinner.show();
    this.adsService.deleteAds(id).pipe(finalize(() => this.spinner.hide()))
      .subscribe({ next: res => { this.myAds = this.myAds.filter(ads => ads.id != res.id) } });
  }

  openModalCreateAd() {
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth: '100%',
    }).afterClosed().subscribe({
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
    }).afterClosed().subscribe({
      next: async (payload: PayloadCreateAds) => {
        if (payload) {
          this.updateAds(payload)
        }
      }
    })
  }
}

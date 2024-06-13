import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface, EditAdsInterface } from "../../models/ads.interface";
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from '../ads.service';
import { Observable, finalize } from 'rxjs';


@Component({
  selector: 'app-adverts',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatCardModule],
  templateUrl: './adverts.component.html',
  styleUrl: './adverts.component.scss'
})
export class AdvertsComponent {

  ads: AdsInterface[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private adsService: AdsService
  ) { }

  ngOnInit() {
    this.listAds()
  }

  listAds(): Observable<EditAdsInterface[]> {
    this.spinner.show();
    this.adsService.getListAds()
    .subscribe({
      next: (ads: EditAdsInterface[]) => {
        this.ads = ads;
        this.spinner.hide();
      }
    });
    return this.adsService.getListAds();
  }
}

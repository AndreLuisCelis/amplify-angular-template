import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface, EditAdsInterface } from "../../models/ads.interface";
import { getUrl } from 'aws-amplify/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from '../ads.service';
import { finalize } from 'rxjs';

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

  constructor(
    private spinner: NgxSpinnerService,
    private adsService: AdsService
  ) { }

  ngOnInit() {
    this.listAds()
  }

  listAds() {
    this.spinner.show();
    this.adsService.getListAds()
    .subscribe({
      next: (ads: EditAdsInterface[]) => {
        this.ads = ads;
        this.spinner.hide();
      },
      error:()=> this.spinner.hide()
    });
  }
}

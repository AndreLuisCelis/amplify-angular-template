import { Component } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface } from '../../models/ads.interface';

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
        next: ({ items, isSynced }) => {
          this.ads = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }
}

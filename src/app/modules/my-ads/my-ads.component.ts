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



const client = generateClient<Schema>();

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [MatButtonModule , CommonModule, MatCardModule],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.scss'
})
export class MyAdsComponent {

  ads: EditAdsInterface[] = [];

  constructor(
    public dialog: MatDialog, 
    private authenticator: AuthenticatorService,
  ){}

  ngOnInit(){
    this.listMyAds();
  }

  listMyAds() {
    try {
      client.models.Ads.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.ads = items.filter(ad => {
            return ad.owner === this.authenticator.user.userId
          });
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
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
      if(ad.id){
        client.models.Ads.update(ad);
        this.listMyAds();
      }
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  openModalCreateAd(){
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth:'100%',
    })
    .afterClosed().subscribe({
      next: (res)=> {
        if(res){
          try {
             uploadData({
              data: res.result,
              path: `picture-submissions/${res.file.name}`
            });
          } catch (e) {
            console.log("error", e);
          }
          let ad:AdsInterface = {
            title: res.data.title,
            description: res.data.description,
            images:[`picture-submissions/${res.file.name}`]
          }
          this.createAd(ad)
        }
      }
    })
  }

  openModalUpdateAd(ad: EditAdsInterface){
    this.dialog.open(DialogCreateEditAdsComponent, {
      maxWidth:'100%',
      data: ad
    })
    .afterClosed().subscribe({
      next: (adRes: EditAdsInterface)=> {
        if(adRes){
          this.updateAd(adRes)
        }
      }
    })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }

}

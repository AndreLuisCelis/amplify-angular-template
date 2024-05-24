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
import { getUrl } from 'aws-amplify/storage';
import { aws_location } from 'aws-cdk-lib';



const client = generateClient<Schema>();

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [MatButtonModule , CommonModule, MatCardModule],
  templateUrl: './my-ads.component.html',
  styleUrl: './my-ads.component.scss'
})
export class MyAdsComponent {

  myAds: EditAdsInterface[] = [];
  srcTesteImg ='';

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
        next:  async ({ items, isSynced }) => {

       // filter ads from awners
       this.myAds =  items.filter(adFilterUser => {
            return adFilterUser.owner === this.authenticator.user.userId
          })

       // get url for images 
       this.myAds.map (async (adMapForAddSrcImage: any, index) => {
              let urlOutput = await getUrl({
                path: adMapForAddSrcImage.images[0],
                options: {
                  validateObjectExistence: false,  // defaults to false
                  expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                }
              })
               adMapForAddSrcImage.srcImage = urlOutput.url.toString();
               this.myAds[index] = adMapForAddSrcImage;
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
      next: async (res)=> {
        if(res){
          let path ='';
          try {
             await uploadData({
              data: res.result,
              path: `profile-pictures/${res.file.name}`
            }).result.then( resultado => {
              path = resultado.path;
          });
          } catch (e) {
            console.log("error", e);
          }
          let ad:AdsInterface = {
            title: res.data.title,
            description: res.data.description,
            images:[path]
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
      next: async (adRes)=> {
        if(adRes){
          let path ='';
          try {
             await uploadData({
              data: adRes.result,
              path: `profile-pictures/${adRes.file.name}`
            }).result.then( resultado => {
              path = resultado.path;
          });
          } catch (e) {
            console.log("error", e);
          }
          let ad:EditAdsInterface = {
            id: adRes.data.id,
            title: adRes.data.title,
            description: adRes.data.description,
            images:[path]
          }
          this.updateAd(ad)
        }
      }
    })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }
}

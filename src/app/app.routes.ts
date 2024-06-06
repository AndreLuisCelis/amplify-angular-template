import { Routes } from '@angular/router';
import { AdvertsComponent } from './modules/adverts/adverts.component';
import { MyAdsComponent } from './modules/my-ads/my-ads.component';

export const routes: Routes = [
    {
        path: 'adverts',
        component: AdvertsComponent,
        title:'Anuncios',
    },
    {
        path: 'my-ads',
        component: MyAdsComponent,
        title: 'Meus Anuncios',
    },
    {
        path: '**',
        redirectTo: 'adverts',
        pathMatch: 'full',
    },
];

import { Routes } from '@angular/router';
import { AdvertsComponent } from './modules/adverts/adverts.component';
import { TodosComponent } from './modules/todos/todos.component';
import { MyAdsComponent } from './modules/my-ads/my-ads.component';

export const routes: Routes = [
    {
        path: 'adverts',
        component: AdvertsComponent,
        title:'Anuncios',
    },
    {
        path: 'todos',
        component: TodosComponent,
        title: 'Todos',
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

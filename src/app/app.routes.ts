import { Routes } from '@angular/router';
import { AdvertsComponent } from './adverts/adverts.component';
import { TodosComponent } from './todos/todos.component';

export const routes: Routes = [
    {
        path: 'adverts',
        component: AdvertsComponent,
        title:'Anuncios',
        data: {
            title: "Anuncios"
        }
    },
    {
        path: 'todos',
        component: TodosComponent,
        title: 'Todos',
        data: {
            title: "Todos"
        }
    },
    {
        path: '**',
        redirectTo: 'adverts',
        pathMatch: 'full',
    },
];

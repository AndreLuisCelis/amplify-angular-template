import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { AdsInterface, EditAdsInterface } from "../../models/ads.interface";
import { NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from '../ads.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule} from '@angular/material/autocomplete'


@Component({
  selector: 'app-adverts',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule
  ],
  templateUrl: './adverts.component.html',
  styleUrl: './adverts.component.scss'
})
export class AdvertsComponent {

  ads: AdsInterface[] = [];
  copyAdsForSearch:EditAdsInterface[] = [];
  searchControl = new FormControl();

  constructor(
    private spinner: NgxSpinnerService,
    private adsService: AdsService
  ) { }

  ngOnInit() {
    this.listAds();
    this.startSearch();
  }

  listAds(): Observable<EditAdsInterface[]> {
    this.spinner.show();
    this.adsService.getListAds()
    .subscribe({
      next: (ads: EditAdsInterface[]) => {
        this.createCopyAdsForSearch(ads);
        this.ads = ads;
        console.log(ads)
       
        this.spinner.hide();
      }
    });
    return this.adsService.getListAds();
  }

  createCopyAdsForSearch(ads: EditAdsInterface[]){
    this.copyAdsForSearch = JSON.parse(JSON.stringify(ads));
  }

  startSearch() {
    // Faz uma subscrição para pegar o valor do input de pesquisa e retornar o resultado
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.ads = this.search(value) as [];
        console.log(this.ads)
        return this.ads
      })
    ).subscribe();
  }

  private search(value: string): any[] {
    const SearchValue = value?.toLowerCase();
    return this.adsService.getUrlImagesAds(
      this.copyAdsForSearch
      .filter((option: EditAdsInterface) =>  {
       return option?.title.toLowerCase().includes(SearchValue) 
      //  MORE OPTIONS OF SEARCH
        // || option?.description.toLowerCase().includes(filterValue)
        // || option?.user?.email?.toLowerCase().includes(filterValue) 
  }));
  }
}

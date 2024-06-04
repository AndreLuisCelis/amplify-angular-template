import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationComponent } from './navigation.component';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, Router, RouterModule, Routes, provideRouter } from '@angular/router';
import { AdvertsComponent } from '../../adverts/adverts.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;

  const routes: Routes = [
    {
        path: 'adverts',
        component: AdvertsComponent,
        title:'Anuncios',
    }
  ]

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        RouterModule,
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: router,
        },
        provideRouter(routes)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should handlePageTitle is called in onInit', () => {
    let spieHandleTitle = spyOn(component, 'handlePageTitle').and.callThrough();
    component.ngOnInit();
    expect(spieHandleTitle).toHaveBeenCalledTimes(1);
  });

  it('should signOut is called', () => {
    let spiesingOutEvent = spyOn(component, 'signOut').and.callThrough();
    component.signOut();
    expect(spiesingOutEvent).toHaveBeenCalledTimes(1);
  });

  it('should logout equal true', () => {
    component.signOut();
    expect(component.logout).toBeTruthy();
  });

  it('should page title', () => {
  component.pageTitle = 'Title';
  component.handlePageTitle();
  expect(component.pageTitle).toBe('Title')
   router.events.subscribe( () => {
    component.pageTitle = component.pageTitle +' later router event';
    expect(component.pageTitle).toBe('Title'+ ' later router event' )
   })
    router.navigateByUrl('/adverts')
  });

});

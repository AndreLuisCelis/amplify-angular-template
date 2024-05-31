import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, RouterModule, Router } from '@angular/router';

interface MenuItemNav {
  icon: string;
  path: string;
  label: string;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    MatMenuModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ]
})

export class NavigationComponent implements OnInit {


  private breakpointObserver = inject(BreakpointObserver);
  // private activeRouter = inject(ActivatedRoute);
  private router = inject(Router);


  menuNav: MenuItemNav[] = [
    {
      icon: 'record_voice_over',
      path: '/adverts',
      label: 'Anuncios'
    },
    {
      icon: 'add_task',
      path: '/my-ads',
      label: 'Meus Anuncíos'
    }
    
  ]

  @Input() user: any;
  @Output() signOutEvent = new EventEmitter();
  pageTitle = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor() { }

  ngOnInit() {
    this.handlePageTitle();
  }

  handlePageTitle(): void {
    this.pageTitle = this.router.routerState.root.firstChild?.snapshot.title ?? '';
    this.router.events.subscribe(() => {
      this.pageTitle = this.router.routerState.root.firstChild?.snapshot.title ?? '';
    })
  }

  signOut(): void {
    this.signOutEvent.emit(true);
  }
}

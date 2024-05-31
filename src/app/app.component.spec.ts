import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { MatDividerModule } from '@angular/material/divider';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        AppComponent, 
        RouterOutlet,
        AmplifyAuthenticatorModule,
      ],
      providers: [ ]
    }).compileComponents();
     fixture = TestBed.createComponent(AppComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'amplify-angular-template' title`, () => {
    expect(component.title).toEqual('amplify-angular-template');
  });

  it('should amplify-authenticator', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    let email = document.getElementById("amplify-authenticator");
    expect(compiled.querySelector('amplify-authenticator')).toBeTruthy();
  });
});

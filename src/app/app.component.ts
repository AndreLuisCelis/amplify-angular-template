import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './modules/shared/navigation/navigation.component';
import { NgxSpinnerModule } from 'ngx-spinner';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet, 
    AmplifyAuthenticatorModule,
    CommonModule,
    NavigationComponent,
    NgxSpinnerModule,
  ],
})
export class AppComponent {
  title = 'amplify-angular-template';
  constructor(public authenticator: AuthenticatorService) {
    // Amplify.configure(outputs);
  }
}

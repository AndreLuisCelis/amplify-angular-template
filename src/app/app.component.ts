import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './shared/navigation/navigation.component';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet, 
    TodosComponent, 
    AmplifyAuthenticatorModule,
    CommonModule,
    NavigationComponent
  ],
})
export class AppComponent {
  title = 'amplify-angular-template';
    
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }
}

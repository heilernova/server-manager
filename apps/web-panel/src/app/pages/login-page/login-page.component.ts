import { Component } from '@angular/core';
import { FormLoginSessionComponent } from '@app/components/form-login-session';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormLoginSessionComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}

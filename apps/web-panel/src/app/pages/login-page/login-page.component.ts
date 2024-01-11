import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ISession, SessionService } from '@app/common/sessions';
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
  private readonly _router = inject(Router);
  private readonly _sessions = inject(SessionService);
  constructor(){}

  session(value: ISession){
    this._sessions.user = value;
    this._router.navigate(['/']);
  }
}

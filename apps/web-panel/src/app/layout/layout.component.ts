import { Component, inject, signal } from '@angular/core';
import { SessionService } from '@app/common/sessions';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { FormLoginSessionComponent } from '@app/components/form-login-session';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    NzMenuModule,
    NzDropDownModule,
    NzButtonModule,
    NzDrawerModule,
    FormLoginSessionComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _sessions = inject(SessionService);
  private readonly _router = inject(Router);
  public readonly openNewSession = signal<boolean>(false);
  nameUser = signal<string>('');

  constructor(){
    this._sessions.userChange.subscribe(user => {
      this.nameUser.set(user ? `${user.name} ${user.lastName}` : '');
    })
  }

  onClickOpenNewSession(){
    this.openNewSession.set(true);
  }
  onClickCloseNewSession(){
    this.openNewSession.set(false);
  }

  onClickCloseSession(){
    if (this._sessions.user){
      this._sessions.delete(this._sessions.user.id).then(() => {
        this._sessions.user = null;
        this._router.navigate(['/login']);
      })
    }
  }
}

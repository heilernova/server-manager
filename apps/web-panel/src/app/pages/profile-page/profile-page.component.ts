import { Component, inject } from '@angular/core';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ModalUpdatePasswordComponent } from '@app/components/modal-update-password/modal-update-password.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzModalModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly _modalService = inject(NzModalService);

  onClickUpdatePassword(){
    this._modalService.create({
      nzTitle: 'Actualizar contraseña',
      nzContent: ModalUpdatePasswordComponent
    });
  }
}

import { Component, inject } from '@angular/core';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ModalUpdatePasswordComponent } from '@app/components/modal-update-password/modal-update-password.component';
import { ApiProfileService } from '@app/common/api/profile';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
  private readonly _apiProfile = inject(ApiProfileService);

  public readonly formGroup = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    cellphone: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  })

  constructor(){
    this._apiProfile.getInfo().subscribe({
      next: res => {
        this.formGroup.setValue({
          name: res.name,
          lastName: res.lastName,
          username: res.username,
          email: res.email,
          cellphone: res.cellphone
        })
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onClickUpdatePassword(){
    this._modalService.create({
      nzTitle: 'Actualizar contraseña',
      nzContent: ModalUpdatePasswordComponent
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modal-update-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzCheckboxModule,
    NzDividerModule
  ],
  templateUrl: './modal-update-password.component.html',
  styleUrl: './modal-update-password.component.scss'
})
export class ModalUpdatePasswordComponent {
  private readonly _message = inject(NzMessageService);
  public readonly disabled = signal<boolean>(true);
  public readonly loading = signal<boolean>(false);
  public readonly formGroup = new FormGroup({
    currentPassword: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  })
  showPassword = false;
  constructor(private _modal: NzModalRef) {
    this.formGroup.statusChanges.subscribe(value => {
      this.disabled.set(value == 'INVALID')
    })
  }

  destroyModal(): void {
    this._modal.destroy();
  }

  updatePassword(): void {
    if (this.formGroup.invalid){
      this._message.warning('Falta campos por completar');
      return;
    }

    let values = this.formGroup.getRawValue();

    if (values.newPassword != values.confirmPassword){
      this._message.warning("Las contraseñas no coinciden");
      return;
    }
    
    this._modal.getConfig().nzClosable = false;
    this._modal.getConfig().nzCancelDisabled = false;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}

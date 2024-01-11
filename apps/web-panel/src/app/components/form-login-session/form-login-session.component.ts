import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-form-login-session',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './form-login-session.component.html',
  styleUrl: './form-login-session.component.scss'
})
export class FormLoginSessionComponent {
  private readonly _message = inject(NzMessageService)
  public readonly loading = signal<boolean>(false);
  public readonly disabled = signal<boolean>(true);
  public readonly formGroup = new FormGroup({
    ssl: new FormControl<'https://' | 'http://'>('https://', { nonNullable: true }),
    server: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(){
    this.formGroup.statusChanges.subscribe(val => {
      this.disabled.set(val != 'VALID');
    })
  }

  singIn(){
    if (this.formGroup.invalid){
      this._message.warning('Faltan campos por completar');
      return;
    }
    let formValues = this.formGroup.getRawValue();
    let credentials = {
      url: `${formValues.ssl}${formValues.server.replace(/\/$/, '')}`,
      username: formValues.username,
      password: formValues.password
    }

    this.formGroup.disable();
    this.loading.set(true);
    setTimeout(() => {
      this.formGroup.enable();
      this.loading.set(false);
      console.log(credentials);
    }, 3000);
  }
}

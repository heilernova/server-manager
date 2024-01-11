import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApiAuthService } from '@app/common/api/auth';
import { ISession, SessionService } from '@app/common/sessions';

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
  private readonly _apiAuth = inject(ApiAuthService);
  private readonly _message = inject(NzMessageService);
  private readonly _session = inject(SessionService);

  public readonly loading = signal<boolean>(false);
  public readonly disabled = signal<boolean>(true);
  public readonly formGroup = new FormGroup({
    ssl: new FormControl<'https://' | 'http://'>('https://', { nonNullable: true }),
    server: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  @Output()
  public session = new EventEmitter<ISession>();

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
    let url: string = `${formValues.ssl}${formValues.server.replace(/\/$/, '')}`
    this.formGroup.disable();
    this.loading.set(true);
    this._apiAuth.signIn(url, { username: formValues.username, password: formValues.password })
    .subscribe({
      next: res => {
        this.formGroup.enable();
        this.loading.set(false);
        this._session.save({ url,  ...res})
        .then(session => {
          this.session.emit(session);
        })
        .catch(err => {
          console.log(err);
          this._message.error('Error al guardar la sesión');
        })
      },
      error: err => {
        if (err instanceof HttpErrorResponse){
          if (err.status == 0){
            this._message.error(err.message);
          } else if (err.status == 500){
            this._message.error('Error con el servidor');
          } else if (err.status == 400){
            this._message.error(err.error.message ?? err.message);
          }
        } else {
          this._message.error('Error inesperado');
        }
        this.formGroup.enable();
        this.loading.set(false);
      }
    })
  }
}

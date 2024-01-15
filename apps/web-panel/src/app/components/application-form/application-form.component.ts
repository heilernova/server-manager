import { Component, inject, Input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

import { ApiAppsService, Application, Framework, RunningOn, RuntimeEnvironment } from '@app/common/api/apps';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzDropDownModule,
    NzModalModule
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent {
  private readonly _apiApps = inject(ApiAppsService);
  private readonly _message = inject(NzMessageService);
  
  public readonly buttonSaveLoading = signal<boolean>(false);
  public readonly buttonDisable = signal<boolean>(false);

  formGroup = new FormGroup({
    domain: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/[^\s/$.?#].[^\s]*$/i)]}),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required]}),
    location: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    startupFile: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    runtimeEnvironment: new FormControl<RuntimeEnvironment>(null),
    framework: new FormControl<Framework>(null),
    runningOn: new FormControl<RunningOn>(null),
    ignore: new FormControl<string[]>([]),
    env: new FormArray<FormGroup<{ name: FormControl<string>, value: FormControl<string> }>>([])
  });

  private _modal: NzModalService = inject(NzModalService);
  private _application: Application | null = null;
  public readonly controlsApp = signal<boolean>(false);
  @Input()
  set data(value: Application){
    this._application = value;
    this.controlsApp.set(true);
    this.formGroup.setValue({
      domain: value.domain,
      name: value.name,
      location: value.location,
      startupFile: value.startupFile ?? '',
      runtimeEnvironment: value.runtimeEnvironment, 
      framework: value.framework,
      runningOn: value.runningOn,
      ignore: value.ignore,
      env: []
    });
    Object.entries(value.env).forEach(entry => {
      let form = new FormGroup({
        name: new FormControl<string>(entry[0], { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[A-Za-z_]+[A-Za-z0-9_]*$/)] }),
        value: new FormControl<string>(entry[1], { nonNullable: true, validators: Validators.required }),
      });
      this.formGroup.controls.env.push(form);
    })
  }

  constructor(){

  }

  onClickAddEnvironment(index: number): void {
    let len = this.formGroup.controls.env.length;
    let form = new FormGroup({
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[A-Za-z_]+[A-Za-z0-9_]*$/)] }),
      value: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    })
    
    if (index == (len - 1)){
      this.formGroup.controls.env.push(form);
    } else  {
      this.formGroup.controls.env.controls.splice(index + 1, 0, form);
    }
  }

  onClickRemoveEnvironment(index: number): void {
    this.formGroup.controls.env.removeAt(index);
  }

  onSave(): void {
    if (this.formGroup.invalid){
      this._message.warning("Faltan campos por completar");
      Object.values(this.formGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    let values = this.formGroup.getRawValue();
    let env: { [key:string]: string } = {}
    values.env.forEach(value => {
      env[value.name.toUpperCase()] = value.value.toString();
    });
    this.formGroup.disable();
    this.buttonSaveLoading.set(true);
    this.buttonDisable.set(true);
    if (this._application){
      this._apiApps.update(this._application.id, {
        domain: values.domain,
        name: values.name,
        runtimeEnvironment: values.runtimeEnvironment,
        framework: values.framework,
        runningOn: values.runningOn,
        location: values.location,
        startupFile: values.startupFile,
        ignore: values.ignore ?? [],
        env
      }).subscribe({
        next: res => {
          this.buttonSaveLoading.set(false);
          this.buttonDisable.set(false);
          this.formGroup.enable();
          this._message.success("Datos actualizados");
        },
        error: err => {
          this.formGroup.enable();
          this.buttonSaveLoading.set(false);
          this.buttonDisable.set(false);
          if (err instanceof HttpErrorResponse){
            this._message.error(err.error.message ?? err.message);
          } else {
            this._message.error("Error inesperado");
          }
        }
      })
      return;
    }
    this._apiApps.create({
      domain: values.domain,
      name: values.name,
      runtimeEnvironment: values.runtimeEnvironment,
      framework: values.framework,
      runningOn: values.runningOn,
      location: values.location,
      startupFile: values.startupFile,
      ignore: values.ignore ?? [],
      env
    }).subscribe({
      next: response => {
        this.buttonDisable.set(false);
        this.formGroup.enable();
        this.buttonSaveLoading.set(false);
        console.log(response);
      },
      error: err => {
        this.buttonDisable.set(false);
        this.formGroup.enable();
        this.buttonSaveLoading.set(false);
        if (err instanceof HttpErrorResponse){
          this._message.error(err.error.message ?? err.message);
        } else {
          this._message.error("Error inesperado");
        }
      }
    })
  }

  onReload(){
    if (this._application){
      this._apiApps.reload(this._application.id).subscribe({
        next: res => {
          this._message.success("Aplicación reiniciada");
        },
        error: err => {
          if (err instanceof HttpErrorResponse){
            this._message.error(err.error.message ?? err.message);
          }
          this._message.error("Error al reiniciar la aplicación");
        }
      })
    }
  }

  onDelete(){
    this._modal.confirm({
      nzTitle: '¿Esta seguro de eliminar la aplicación?',
      nzContent: 'Una vez eliminado no se podrá recuperar la información',
      nzOkText: 'Si',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        if (this._application){
          this._apiApps.delete(this._application.id).subscribe({
            next: res => {
              this._message.success("Aplicación eliminada");
            },
            error: err => {
              this._message.error("No se pudo eliminar la aplicación");
            }
          })
        }
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}

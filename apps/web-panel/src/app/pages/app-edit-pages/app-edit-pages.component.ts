import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiAppsService, Application } from '@app/common/api/apps';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-app-edit-pages',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzButtonComponent,
    NzSelectModule
  ],
  templateUrl: './app-edit-pages.component.html',
  styleUrl: './app-edit-pages.component.scss'
})
export class AppEditPagesComponent {
  private _apiApplications = inject(ApiAppsService);
  private _activatedRoute = inject(ActivatedRoute);
  private _message = inject(NzMessageService);

  public readonly disabled = signal<boolean>(false);
  public readonly loading = signal<boolean>(false);
  public readonly application: Application;
  public readonly formGroup = new FormGroup({
    domain: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    location: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    startupFile: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    observation: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    framework: new FormControl<string | null>(null, { nonNullable: true, validators: Validators.required }),
    runningOn: new FormControl<string | null>(null, { nonNullable: true, validators: Validators.required }),
    runtimeEnvironment: new FormControl<string | null>(null, { nonNullable: true, validators: Validators.required }),
    ignore: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
    env: new FormArray<FormGroup<{ name: FormControl<string>, value: FormControl<string> }>>([])
  })
  constructor(){
    this.application = this._activatedRoute.snapshot.data['application'];

    this.formGroup.setValue({
      domain: this.application.domain,
      name: this.application.name,
      location: this.application.location,
      startupFile: this.application.startupFile ?? '',
      url: this.application.url ?? '',
      observation: this.application.observation ?? '',
      framework: this.application.framework,
      runningOn: this.application.runningOn,
      runtimeEnvironment: this.application.runtimeEnvironment,
      ignore: this.application.ignore,
      env: []
    })
    
    let env = Object.entries(this.application.env);
    env.forEach(entry => {
      console.log(entry);
      this.formGroup.controls.env.push(new FormGroup({
        name: new FormControl<string>(entry[0], { nonNullable: true, validators: Validators.required }),
        value: new FormControl<string>(entry[1], { nonNullable: true, validators: Validators.required }),
      }))
    });
  }

  onClickAddEnv(): void {
    this.formGroup.controls.env.push(new FormGroup({
      name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      value: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    }))
  }

  onClickDeleteEnv(index: number): void {
    this.formGroup.controls.env.removeAt(index);
  }

  onClickResetChanges(): void {
    
  }

  onClickSave(): void {
    if (this.formGroup.invalid){
      return;
    }
    let values = this.formGroup.getRawValue();
    let env: { [name: string]: string } = {};
    values.env.forEach(item => env[item.name.toUpperCase()] = item.value.toString());
    (values as any).env = env;
    this.formGroup.disable();
    this.loading.set(true);
    this._apiApplications.update(this.application.id, values).subscribe({
      next: res => {
        this.loading.set(false);
        this._message.success("Información actualizada");
        this.formGroup.enable();
      },
      error: err => {
        this.loading.set(false);
        this._message.error("Error a actualizar la información");
        this.formGroup.enable();
      }
    })
  }
}

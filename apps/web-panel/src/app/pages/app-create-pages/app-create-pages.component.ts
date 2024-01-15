import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationFormComponent } from '@app/components/application-form/application-form.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-app-create-pages',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ApplicationFormComponent
  ],
  templateUrl: './app-create-pages.component.html',
  styleUrl: './app-create-pages.component.scss'
})
export class AppCreatePagesComponent {
  public readonly formGroup = new FormGroup({
    domain: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    location: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    startupFile: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    observation: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    framework: new FormControl<string | null>(null, { nonNullable: true, validators: Validators.required }),
    runningOn: new FormControl<string | null>(null, { nonNullable: true, validators: Validators.required }),
    runtimeEnvironment: new FormControl<string | null>(null, { nonNullable: true }),
    ignore: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
    env: new FormArray<FormGroup<{ name: FormControl<string>, value: FormControl<string> }>>([])
  })

}

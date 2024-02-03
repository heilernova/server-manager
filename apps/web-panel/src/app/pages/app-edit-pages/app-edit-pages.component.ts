import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiAppsService, Application } from '@app/common/api/apps';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ApplicationFormComponent } from '@app/components/application-form/application-form.component';
import { Breadcrumbs } from '@app/layout/breadcrumbs.interfaces';

@Component({
  selector: 'app-app-edit-pages',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ApplicationFormComponent,
    NzInputModule,
    NzButtonComponent,
    NzSelectModule,
    NzFormModule
  ],
  templateUrl: './app-edit-pages.component.html',
  styleUrl: './app-edit-pages.component.scss'
})
export class AppEditPagesComponent {
  private _apiApplications = inject(ApiAppsService);
  private _activatedRoute = inject(ActivatedRoute);
  private _message = inject(NzMessageService);
  public readonly application: Application;
  public breadcrumbs: Breadcrumbs[];

  constructor(){
    this.application = this._activatedRoute.snapshot.data['application'];
    this.breadcrumbs =  [{ name: "Apps", slug: 'apps' }, { name: this.application.id, slug: this.application.id }];
  }

 
  onClickSave(): void {
    
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiAppsService, Application } from '@app/common/api/apps';

@Component({
  selector: 'app-app-list-pages',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './app-list-pages.component.html',
  styleUrl: './app-list-pages.component.scss'
})
export class AppListPagesComponent {
  private readonly _apiApps = inject(ApiAppsService);

  public readonly list = signal<Application[]>([]);
  constructor(){
    this._apiApps.getAll().subscribe(val => {
      this.list.set(val);
    })
  }
}

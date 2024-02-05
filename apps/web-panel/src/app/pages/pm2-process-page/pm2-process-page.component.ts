import { Component, inject } from '@angular/core';
import { ApiPm2Service } from '@app/common/api/pm2';
import { Breadcrumbs } from '@app/layout';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pm2-process-page',
  standalone: true,
  imports: [],
  templateUrl: './pm2-process-page.component.html',
  styleUrl: './pm2-process-page.component.scss'
})
export class Pm2ProcessPageComponent {
  breadcrumbs: Breadcrumbs[] = [ { name: "PM2", slug: "pm2" } ];

  private readonly _apiPM2 = inject(ApiPm2Service);
  private readonly _message = inject(NzMessageService);

  constructor(){
    this._apiPM2.getAllProcess().subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        this._message.error("Error con el servidor");
      }
    })
  }
}

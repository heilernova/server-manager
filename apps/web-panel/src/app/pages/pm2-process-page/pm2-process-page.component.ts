import { Component } from '@angular/core';
import { Breadcrumbs } from '@app/layout';

@Component({
  selector: 'app-pm2-process-page',
  standalone: true,
  imports: [],
  templateUrl: './pm2-process-page.component.html',
  styleUrl: './pm2-process-page.component.scss'
})
export class Pm2ProcessPageComponent {
  breadcrumbs: Breadcrumbs[] = [ { name: "PM2", slug: "pm2" } ];
}

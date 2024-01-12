import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ApiAppsService, Application } from '@app/common/api/apps';
import { NzMessageService } from 'ng-zorro-antd/message';

export const appEditPageResolver: ResolveFn<Application> = (route, state) => {
  return new Promise((resolve, reject) => {
    const apiApps = inject(ApiAppsService);
    const router = inject(Router);
    const message = inject(NzMessageService);
    let id = route.params['id'];

    apiApps.get(id).subscribe({
      next: res => {
        resolve(res);
      },
      error: err => {
        message.error("Aplicación no encontrada");
        router.navigate(['/apps']);
      }
    })

  })
};

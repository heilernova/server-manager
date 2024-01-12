import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionService } from '@app/common/sessions';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const sessions = inject(SessionService);
  let url: string = req.url;
  let headers: HttpHeaders | undefined;
  if (sessions.user){
    url = `${sessions.user.url}/${url}`;
    headers = (new HttpHeaders()).append(sessions.user.authorization.name, sessions.user.authorization.value);
  }
  return next(req.clone({ url, headers }));
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@app/common/sessions';

export const loginPageGuard: CanActivateFn = async (route, state) => {
  const sessions = inject(SessionService);
  const router = inject(Router);
  return await sessions.load() ? router.createUrlTree(['/']) : true;
};

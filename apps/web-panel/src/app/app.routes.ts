import { Routes } from '@angular/router';
import { layoutGuard } from '@app/layout';
import { loginPageGuard } from '@app/pages/login-page/login-page.guard';

export const routes: Routes = [
    { path: 'login', canActivate: [loginPageGuard], loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    {
        path: '',
        canActivate: [layoutGuard],
        loadComponent: () => import('./layout/layout.component').then(x => x.LayoutComponent),
        children: [
            { path: 'profile', loadComponent: () => import('./pages/profile-page/profile-page.component').then(x => x.ProfilePageComponent) }
        ]
    }
];

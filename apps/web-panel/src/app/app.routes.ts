import { Routes } from '@angular/router';
import { layoutGuard } from '@app/layout';
import { loginPageGuard } from '@app/pages/login-page/login-page.guard';
import { appEditPageResolver } from './pages/app-edit-pages/app-edit-page.resolver';

export const routes: Routes = [
    { path: 'login', canActivate: [loginPageGuard], loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    {
        path: '',
        canActivate: [layoutGuard],
        loadComponent: () => import('./layout/layout.component').then(x => x.LayoutComponent),
        children: [
            { path: 'profile', loadComponent: () => import('./pages/profile-page/profile-page.component').then(x => x.ProfilePageComponent) },
            { path: 'apps', loadComponent: () => import('./pages/app-list-pages/app-list-pages.component').then(x => x.AppListPagesComponent) },
            { path: 'apps/create', loadComponent: () => import('./pages/app-create-pages/app-create-pages.component').then(x => x.AppCreatePagesComponent) },
            { path: 'apps/:id', resolve: { application: appEditPageResolver }, loadComponent: () => import('./pages/app-edit-pages/app-edit-pages.component').then(x => x.AppEditPagesComponent) },
        ]
    }
];

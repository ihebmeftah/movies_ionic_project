import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { noAuthGuard } from '../guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
    canActivate: [noAuthGuard] // Redirect to /tabs/home if already logged in
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage),
    canActivate: [noAuthGuard] // Redirect to /tabs/home if already logged in
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule { }

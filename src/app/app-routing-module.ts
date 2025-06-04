import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth-guard';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./components/main/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./components/users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'access',
    loadChildren: () =>
      import('./components/access-requests/access-requests.module').then((m) => m.AccessRequestsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'computers',
    loadChildren: () =>
      import('./components/computers/computers.module').then((m) => m.ComputersModule),
    canActivate: [AuthGuard]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

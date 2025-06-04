import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () =>
      import('./components/main/main.module').then((m) => m.MainModule)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./components/users/users.module').then((m) => m.UsersModule)
  },
  {
    path: 'access',
    loadChildren: () =>
      import('./components/access-requests/access-requests.module').then((m) => m.AccessRequestsModule)
  },
  {
    path: 'computers',
    loadChildren: () =>
      import('./components/computers/computers.module').then((m) => m.ComputersModule)
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: '**', redirectTo: 'users'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

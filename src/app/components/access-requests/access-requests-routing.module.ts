import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccessFormComponent} from './pages/access-form/access-form.component';
import {AccessListComponent} from './pages/access-list/access-list';

const routes: Routes = [
  {path: '', component: AccessListComponent},
  {path: 'create', component: AccessFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRequestsRoutingModule {
}

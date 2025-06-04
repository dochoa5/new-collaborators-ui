import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessFormComponent } from './pages/access-form/access-form.component';
import { AccessRequestsRoutingModule } from './access-requests-routing.module';
import {AccessListComponent} from './pages/access-list/access-list';

@NgModule({
  imports: [
    CommonModule,
    AccessRequestsRoutingModule,
    AccessFormComponent,
    AccessListComponent
  ]
})
export class AccessRequestsModule {}

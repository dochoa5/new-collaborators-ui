
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UserListComponent } from './pages/user-list/user-list.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    UserFormComponent,
    UserListComponent
  ]
})
export class UsersModule {}

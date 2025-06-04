import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComputerAssignFormComponent} from './pages/assignments/computer-assign-form.component';
import {ComputerListComponent} from './pages/computer-list/computer-list.component';

const routes: Routes = [
  { path: 'assign', component: ComputerAssignFormComponent },
  { path: '', component: ComputerListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputersRoutingModule {}

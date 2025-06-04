import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComputersRoutingModule } from './computers-routing.module';
import {ComputerAssignFormComponent} from './pages/assignments/computer-assign-form.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, ComputersRoutingModule, ComputerAssignFormComponent]
})
export class ComputersModule {}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComputerService } from '../../services/computer.service';
import { UserService } from '../../../users/services/user.service';
import { Computer } from '../../../../../types/computer';
import { User } from '../../../../../types/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-computer-assign-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './computer-assign-form.component.html'
})
export class ComputerAssignFormComponent implements OnInit {
  form!: FormGroup;
  users: User[] = [];
  computers: Computer[] = [];

  @ViewChild('successToast') successToast!: ElementRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly computerService: ComputerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      computer_id: ['', Validators.required],
      assignment_date: ['', Validators.required],
    });

    this.loadUsers();
    this.loadAvailableComputers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => (this.users = res),
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  loadAvailableComputers(): void {
    this.computerService.getAvailableComputers().subscribe({
      next: (res) => (this.computers = res),
      error: (err) => console.error('Error cargando computadores:', err)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    this.computerService.assignComputer(data).subscribe({
      next: () => {
        this.form.reset();

        const toast = new (window as any).bootstrap.Toast(this.successToast.nativeElement);
        toast.show();

        setTimeout(() => {
          this.router.navigate(['/computers']);
        }, 1500);
      },
      error: (err) => console.error('Error al asignar:', err)
    });
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../../../../types/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  userId: string | null = null;
  loading = false;

  availableAreas: string[] = ['TI', 'Recursos Humanos', 'Administración', 'Finanzas'];
  rolesByArea: Record<string, string[]> = {
    'TI': ['Desarrollador', 'QA', 'SysAdmin'],
    'Recursos Humanos': ['Reclutador', 'Generalista'],
    'Administración': ['Asistente Administrativo', 'Jefe Administrativo'],
    'Finanzas': ['Contador', 'Analista Financiero']
  };
  availableRoles: string[] = [];

  @ViewChild('successToast', { static: false }) successToastRef!: ElementRef;
  @ViewChild('errorToast', { static: false }) errorToastRef!: ElementRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      area: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.form.patchValue(user);
          this.onAreaChange(user.area);
        },
        error: (err: any) => console.error('Error loading user', err)
      });
    }
  }

  onAreaChange(selectedArea: string): void {
    this.availableRoles = this.rolesByArea[selectedArea] || [];
    this.form.get('role')?.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const userData = this.form.value;
    this.form.disable();
    this.loading = true;

    const finalize = (callback: () => void) => {
      setTimeout(() => {
        this.loading = false;
        this.form.enable();
        callback();
      }, 2000);
    };

    const onSuccess = () => {
      finalize(() => {
        this.showToast(this.successToastRef);
        setTimeout(() => this.router.navigate(['/users']), 1000);
      });
    };

    const onError = () => {
      console.error('Error en formulario: Ya existe este usuario');
      finalize(() => this.showToast(this.errorToastRef));
    };

    if (this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: onSuccess,
        error: onError
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: onSuccess,
        error: onError
      });
    }
  }

  handleAreaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    const selectedValue = selectElement?.value ?? '';
    this.onAreaChange(selectedValue);
  }

  private showToast(ref: ElementRef) {
    const toastEl = ref.nativeElement;
    const toast = new (window as any).bootstrap.Toast(toastEl);
    toast.show();
  }
}

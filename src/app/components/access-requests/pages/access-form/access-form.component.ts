import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AccessRequestService} from '../../services/access-request.service';
import {UserService} from '../../../users/services/user.service';
import {User} from '../../../../../types/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-access-form',
  standalone: true,
  templateUrl: './access-form.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AccessFormComponent implements OnInit {
  form!: FormGroup;
  users: User[] = [];
  selectedApplications: string[] = [];

  applicationsByType: Record<string, string[]> = {
    software: ['Slack', 'Jira', 'Notion'],
    hardware: ['Equipo Portátil', 'Monitor', 'Teclado'],
    permisos: ['VPN', 'Drive Compartido', 'Acceso a Repositorio']
  };

  availableApplications: string[] = [];

  @ViewChild('successToast') successToast!: ElementRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly accessRequestService: AccessRequestService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      request_type: ['', Validators.required],
      justification: ['', Validators.required]
    });

    this.loadUsers();

    this.form.get('request_type')?.valueChanges.subscribe((type: string) => {
      this.availableApplications = this.applicationsByType[type] || [];
      this.selectedApplications = [];
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  onAppChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedApplications.push(value);
    } else {
      this.selectedApplications = this.selectedApplications.filter(app => app !== value);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedApplications.length === 0) {
      console.warn('Formulario inválido o sin aplicaciones seleccionadas');
      return;
    }

    const {user_id, request_type, justification} = this.form.value;

    const requestData = {
      user_id: Number(user_id),
      request_type,
      applications: this.selectedApplications,
      justification
    };

    this.accessRequestService.createAccessRequest(requestData).subscribe({
      next: () => {
        this.form.reset();
        this.selectedApplications = [];
        const toast = new (window as any).bootstrap.Toast(this.successToast.nativeElement);
        toast.show();

        setTimeout(() => {
          this.router.navigate(['/access']);
        }, 1500);
      },
      error: (err) => console.error('Error al enviar solicitud:', err)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessRequestService } from '../../services/access-request.service';
import { AccessRequest } from '../../../../../types/access-request';

@Component({
  selector: 'app-access-admin-list',
  standalone: true,
  templateUrl: './access-admin-list.component.html',
  imports: [CommonModule]
})
export class AccessAdminListComponent implements OnInit {
  accessRequests: AccessRequest[] = [];
  isLoading = true;

  constructor(private readonly accessRequestService: AccessRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.accessRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.accessRequests = requests;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: number, status: 'approved' | 'rejected'): void {
    this.accessRequestService.updateStatus(id, status).subscribe({
      next: () => {
        this.accessRequests = this.accessRequests.map(req =>
          req.id === id ? { ...req, status } : req
        );
      },
      error: (err) => console.error('Error actualizando estado:', err)
    });
  }

  formatApps(apps: string[]): string {
    return apps.join(', ');
  }
}

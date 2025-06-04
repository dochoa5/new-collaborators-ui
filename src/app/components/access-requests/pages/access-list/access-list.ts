import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { AccessRequestService } from '../../services/access-request.service';
import { AccessRequest } from '../../../../../types/access-request';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-access-list',
  standalone: true,
  templateUrl: './access-list.html',
  imports: [CommonModule, RouterLink]
})
export class AccessListComponent implements OnInit {
  accessRequests: AccessRequest[] = [];
  isLoading = true;

  constructor(private readonly accessRequestService: AccessRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
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

  translateStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  formatApps(apps: string[]): string {
    return apps.join(', ');
  }

  formatDate(date: string): string {
    return formatDate(date, 'yyyy-MM-dd HH:mm', 'en-US');
  }

  updateStatus(id: number, status: 'approved' | 'rejected') {
    this.accessRequestService.updateStatus(id, status).subscribe({
      next: () => this.loadRequests(),
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }
}

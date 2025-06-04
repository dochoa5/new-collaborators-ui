import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessRequestService } from '../../services/access-request.service';
import { of, throwError } from 'rxjs';
import { AccessRequest } from '../../../../../types/access-request';
import { provideHttpClient } from '@angular/common/http';
import {AccessListComponent} from './access-list';
import {provideRouter} from '@angular/router';

describe('AccessListComponent', () => {
  let component: AccessListComponent;
  let fixture: ComponentFixture<AccessListComponent>;
  let mockService: jest.Mocked<AccessRequestService>;

  const mockRequests: AccessRequest[] = [
    {
      id: 1,
      user_id: 1,
      user_name: 'Juan Pérez',
      request_type: 'acceso',
      applications: ['Gmail', 'Slack'],
      justification: 'Necesita acceso urgente',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    mockService = {
      getAllRequests: jest.fn(),
      updateStatus: jest.fn()
    } as unknown as jest.Mocked<AccessRequestService>;

    mockService.getAllRequests.mockReturnValue(of(mockRequests));

    await TestBed.configureTestingModule({
      imports: [AccessListComponent],
      providers: [
        { provide: AccessRequestService, useValue: mockService },
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests on init', () => {
    expect(mockService.getAllRequests).toHaveBeenCalled();
    expect(component.accessRequests).toEqual(mockRequests);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error while loading requests', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockService.getAllRequests.mockReturnValueOnce(throwError(() => new Error('Error de carga')));
    component.loadRequests();
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar solicitudes:', expect.any(Error));
    expect(component.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });

  it('should format apps correctly', () => {
    const result = component.formatApps(['Gmail', 'Jira']);
    expect(result).toBe('Gmail, Jira');
  });

  it('should format date correctly', () => {
    const dateStr = '2024-06-01T15:30:00Z';
    const result = component.formatDate(dateStr);
    expect(result).toMatch(/2024-06-01 1[0-9]:30/);
  });

  it('should translate status', () => {
    expect(component.translateStatus('pending')).toBe('Pendiente');
    expect(component.translateStatus('approved')).toBe('Aprobado');
    expect(component.translateStatus('rejected')).toBe('Rechazado');
    expect(component.translateStatus('otro')).toBe('otro');
  });

  it('should call updateStatus and reload data', () => {
    mockService.updateStatus.mockReturnValue(of({} as AccessRequest));
    const reloadSpy = jest.spyOn(component, 'loadRequests');
    component.updateStatus(1, 'approved');
    expect(mockService.updateStatus).toHaveBeenCalledWith(1, 'approved');
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should handle error on updateStatus', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockService.updateStatus.mockReturnValueOnce(throwError(() => new Error('Falló')));
    component.updateStatus(1, 'rejected');
    expect(consoleSpy).toHaveBeenCalledWith('Error al actualizar estado:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessAdminListComponent } from './access-admin-list.component';
import { of, throwError } from 'rxjs';
import { AccessRequestService } from '../../services/access-request.service';
import { AccessRequest } from '../../../../../types/access-request';
import { provideHttpClient } from '@angular/common/http';

describe('AccessAdminListComponent', () => {
  let component: AccessAdminListComponent;
  let fixture: ComponentFixture<AccessAdminListComponent>;
  let mockService: jest.Mocked<AccessRequestService>;

  const mockRequests: AccessRequest[] = [
    {
      id: 1,
      user_id: 123,
      user_name: 'Juan Pérez',
      request_type: 'acceso',
      applications: ['Correo', 'Drive'],
      justification: 'Necesita acceso para trabajar',
      status: 'pending',
      created_at: "2023-10-01T12:00:00Z",
    }
  ];

  beforeEach(async () => {
    mockService = {
      getAllRequests: jest.fn(),
      updateStatus: jest.fn()
    } as unknown as jest.Mocked<AccessRequestService>;

    await TestBed.configureTestingModule({
      imports: [AccessAdminListComponent],
      providers: [
        { provide: AccessRequestService, useValue: mockService },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessAdminListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests on init', () => {
    mockService.getAllRequests.mockReturnValue(of(mockRequests));

    component.ngOnInit();

    expect(mockService.getAllRequests).toHaveBeenCalled();
    expect(component.accessRequests).toEqual(mockRequests);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error on loadRequests', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockService.getAllRequests.mockReturnValue(throwError(() => new Error('Error al cargar')));

    component.loadRequests();

    expect(mockService.getAllRequests).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar solicitudes:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should update request status on success', () => {
    const updatedStatus: 'approved' = 'approved';
    mockService.updateStatus.mockReturnValue(of({ ...mockRequests[0], status: updatedStatus }));
    component.accessRequests = [...mockRequests];

    component.updateStatus(1, updatedStatus);

    expect(mockService.updateStatus).toHaveBeenCalledWith(1, updatedStatus);
    expect(component.accessRequests[0].status).toBe(updatedStatus);
  });

  it('should handle error on updateStatus', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockService.updateStatus.mockReturnValue(throwError(() => new Error('Error al actualizar')));
    component.accessRequests = [...mockRequests];

    component.updateStatus(1, 'rejected');

    expect(mockService.updateStatus).toHaveBeenCalledWith(1, 'rejected');
    expect(consoleSpy).toHaveBeenCalledWith('Error actualizando estado:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should format applications correctly', () => {
    const apps = ['Correo', 'Drive', 'Slack'];
    expect(component.formatApps(apps)).toBe('Correo, Drive, Slack');
  });
});

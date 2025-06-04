import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AccessFormComponent} from './access-form.component';
import {AccessRequestService} from '../../services/access-request.service';
import {UserService} from '../../../users/services/user.service';
import {of, throwError} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef} from '@angular/core';
import {User} from '../../../../../types/user';

describe('AccessFormComponent', () => {
  let component: AccessFormComponent;
  let fixture: ComponentFixture<AccessFormComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockAccessRequestService: jest.Mocked<AccessRequestService>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Ana Gómez',
      email: 'ana@example.com',
      area: 'Finanzas',
      role: 'Analista'
    },
    {
      id: 2,
      name: 'Luis Torres',
      email: 'luis@example.com',
      area: 'Tecnología',
      role: 'Developer'
    }
  ];

  beforeEach(async () => {
    mockUserService = {
      getAllUsers: jest.fn()
    } as unknown as jest.Mocked<UserService>;

    mockAccessRequestService = {
      createAccessRequest: jest.fn()
    } as unknown as jest.Mocked<AccessRequestService>;

    await TestBed.configureTestingModule({
      imports: [AccessFormComponent, ReactiveFormsModule],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: AccessRequestService, useValue: mockAccessRequestService},
        provideHttpClient()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessFormComponent);
    component = fixture.componentInstance;
    mockUserService.getAllUsers.mockReturnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.value).toEqual({
      user_id: '',
      request_type: '',
      justification: ''
    });
  });

  it('should load users on init', () => {
    mockUserService.getAllUsers.mockReturnValue(of(mockUsers));
    component.loadUsers();
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should handle error on loadUsers', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockUserService.getAllUsers.mockReturnValue(throwError(() => new Error('Error en carga')));
    component.loadUsers();
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar usuarios:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should add selected app on checkbox check', () => {
    const event = {target: {value: 'Slack', checked: true}} as unknown as Event;
    component.onAppChange(event);
    expect(component.selectedApplications).toContain('Slack');
  });

  it('should remove app on checkbox uncheck', () => {
    component.selectedApplications = ['Slack', 'Jira'];
    const event = {target: {value: 'Slack', checked: false}} as unknown as Event;
    component.onAppChange(event);
    expect(component.selectedApplications).toEqual(['Jira']);
  });

  it('should warn and not submit if form is invalid or apps not selected', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    component.form.setValue({user_id: '', request_type: '', justification: ''});
    component.selectedApplications = [];
    component.onSubmit();
    expect(warnSpy).toHaveBeenCalledWith('Formulario inválido o sin aplicaciones seleccionadas');
    expect(mockAccessRequestService.createAccessRequest).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should submit valid form and show toast', () => {
    component.form.setValue({user_id: '1', request_type: 'nuevo', justification: 'test'});
    component.selectedApplications = ['Slack'];

    component.successToast = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    (window as any).bootstrap = {
      Toast: jest.fn().mockImplementation(() => ({show: jest.fn()}))
    };

    mockAccessRequestService.createAccessRequest.mockReturnValue(of({} as any));
    component.onSubmit();

    expect(mockAccessRequestService.createAccessRequest).toHaveBeenCalledWith({
      user_id: 1,
      request_type: 'nuevo',
      justification: 'test',
      applications: ['Slack']
    });

    expect(component.form.value).toEqual({
      user_id: null,
      request_type: null,
      justification: null
    });

    expect(component.selectedApplications).toEqual([]);
  });

  it('should handle error on form submission', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.form.setValue({user_id: '1', request_type: 'nuevo', justification: 'test'});
    component.selectedApplications = ['Slack'];
    mockAccessRequestService.createAccessRequest.mockReturnValue(
      throwError(() => new Error('Fallo al enviar'))
    );
    component.onSubmit();
    expect(consoleSpy).toHaveBeenCalledWith('Error al enviar solicitud:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

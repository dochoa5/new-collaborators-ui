import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ComputerAssignFormComponent} from './computer-assign-form.component';
import {of, throwError} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {ComputerService} from '../../services/computer.service';
import {UserService} from '../../../users/services/user.service';
import {User} from '../../../../../types/user';
import {Computer} from '../../../../../types/computer';
import {provideHttpClient} from '@angular/common/http';

describe('ComputerAssignFormComponent', () => {
  let component: ComputerAssignFormComponent;
  let fixture: ComponentFixture<ComputerAssignFormComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockComputerService: jest.Mocked<ComputerService>;

  const mockUsers: User[] = [
    {id: 1, name: 'Ana Gómez', email: 'ana@example.com', area: 'TI', role: 'Dev'}
  ];

  const mockComputers: Computer[] = [
    {id: 1, brand: 'Dell', model: 'XPS', serial_number: '123ABC', specifications: '16GB RAM', status: 'available'}
  ];

  beforeEach(async () => {
    mockUserService = {
      getAllUsers: jest.fn()
    } as unknown as jest.Mocked<UserService>;

    mockComputerService = {
      getAvailableComputers: jest.fn(),
      assignComputer: jest.fn()
    } as unknown as jest.Mocked<ComputerService>;

    mockUserService.getAllUsers.mockReturnValue(of(mockUsers));
    mockComputerService.getAvailableComputers.mockReturnValue(of(mockComputers));

    await TestBed.configureTestingModule({
      imports: [ComputerAssignFormComponent, ReactiveFormsModule],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: ComputerService, useValue: mockComputerService},
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComputerAssignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.value).toEqual({
      user_id: '',
      computer_id: '',
      assignment_date: ''
    });
  });

  it('should load users on init', () => {
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should load available computers on init', () => {
    expect(mockComputerService.getAvailableComputers).toHaveBeenCalled();
    expect(component.computers).toEqual(mockComputers);
  });

  it('should handle error when loading users', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockUserService.getAllUsers.mockReturnValueOnce(throwError(() => new Error('Error usuarios')));
    component.loadUsers();
    expect(consoleSpy).toHaveBeenCalledWith('Error cargando usuarios:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle error when loading computers', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockComputerService.getAvailableComputers.mockReturnValueOnce(throwError(() => new Error('Error computadores')));
    component.loadAvailableComputers();
    expect(consoleSpy).toHaveBeenCalledWith('Error cargando computadores:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({
      user_id: '',
      computer_id: '',
      assignment_date: ''
    });

    component.onSubmit();
    expect(mockComputerService.assignComputer).not.toHaveBeenCalled();
  });

  it('should submit if form is valid and reset form', () => {
    const assignSpy = jest.spyOn(mockComputerService, 'assignComputer').mockReturnValue(of({
      id: 1,
      computer_id: 1,
      computer_name: 'Dell XPS',
      serial_number: '123ABC',
      user_id: 1,
      user_name: 'Ana Gómez',
      assignment_date: '2025-06-02',
      status: 'assigned'
    }));

    const formResetSpy = jest.spyOn(component.form, 'reset');

    component.form.setValue({
      user_id: '1',
      computer_id: '1',
      assignment_date: '2025-06-02'
    });

    component.onSubmit();

    expect(assignSpy).toHaveBeenCalledWith({
      user_id: '1',
      computer_id: '1',
      assignment_date: '2025-06-02'
    });

    expect(formResetSpy).toHaveBeenCalled();
  });

  it('should log error if assignComputer fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockComputerService.assignComputer.mockReturnValueOnce(throwError(() => new Error('Falló asignación')));

    component.form.setValue({
      user_id: '1',
      computer_id: '1',
      assignment_date: '2025-06-02'
    });

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Error al asignar:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

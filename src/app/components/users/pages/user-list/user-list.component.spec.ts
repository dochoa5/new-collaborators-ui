import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserListComponent} from './user-list.component';
import {UserService} from '../../services/user.service';
import {of, throwError} from 'rxjs';
import {provideRouter, Router} from '@angular/router';
import {User} from '../../../../../types/user';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let router: Router;

  const mockUsers: User[] = [
    {id: 1, name: 'Ana', email: 'ana@mail.com', area: 'TI', role: 'Dev'},
    {id: 2, name: 'Luis', email: 'luis@mail.com', area: 'TI', role: 'QA'},
  ];

  beforeEach(async () => {
    mockUserService = {
      getAllUsers: jest.fn(),
      deleteUser: jest.fn()
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideRouter([]),
        {provide: UserService, useValue: mockUserService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockUserService.getAllUsers.mockReturnValue(of(mockUsers));

    component.ngOnInit();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when loading users', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockUserService.getAllUsers.mockReturnValue(throwError(() => new Error('Error cargando')));

    component.loadUsers();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar usuarios:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should filter users by name or email', () => {
    component.users = mockUsers;
    component.searchTerm = 'ana';

    component.filterUsers();

    expect(component.filteredUsers).toEqual([mockUsers[0]]);
  });

  it('should navigate to edit page on edit', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.onEdit(1);

    expect(navigateSpy).toHaveBeenCalledWith(['/users/edit', '1']);
  });

  it('should delete user and reload list if confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const reloadSpy = jest.spyOn(component, 'loadUsers');
    mockUserService.deleteUser.mockReturnValue(of(void 0));

    component.deleteUser(1);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should not delete user if confirmation is cancelled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteUser(1);

    expect(mockUserService.deleteUser).not.toHaveBeenCalled();
  });
});

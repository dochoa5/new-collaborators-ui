import { FormBuilder } from '@angular/forms';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let routerMock: { navigate: jest.Mock };
  let formBuilder: FormBuilder;

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    formBuilder = new FormBuilder();
    component = new LoginComponent(formBuilder, routerMock as any);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should set error when credentials are invalid', () => {
    component.form.setValue({ username: 'wrong', password: 'wrong' });
    component.login();
    expect(component.error).toBe('Credenciales inválidas');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /main and store auth in localStorage when credentials are valid', () => {
    const setItemSpy = jest.spyOn(window.localStorage['__proto__'], 'setItem');
    component.form.setValue({ username: 'admin', password: '1234' });
    component.login();
    expect(setItemSpy).toHaveBeenCalledWith('auth', 'true');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/main']);
    expect(component.error).toBe('');
    setItemSpy.mockRestore();
  });
});

import {AuthGuard} from './auth-guard';
import {Router} from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    router = {
      navigate: jest.fn()
    } as any;
    guard = new AuthGuard(router);
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should allow access if the user is authenticated', () => {
    localStorage.setItem('auth', 'true');
    expect(guard.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login if the user is not authenticated', () => {
    localStorage.setItem('auth', 'false');
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to /login if there is no authentication value', () => {
    localStorage.removeItem('auth');
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

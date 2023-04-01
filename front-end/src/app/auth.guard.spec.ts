import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginUsuarioComponent }
        ])
      ],
      providers: [AuthGuard]

    });
    guard = TestBed.inject(AuthGuard);
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });


  it('should return true if user data is present in local storage', () => {
    localStorage.setItem('userData', 'fake-user-data');
    expect(guard.canActivate(route, state)).toBe(true);
  });

  it('should navigate to login page and return false if user data is not present in local storage', () => {
    localStorage.removeItem('userData');
    spyOn(TestBed.inject(Router), 'navigateByUrl');
    expect(guard.canActivate(route, state)).toBe(false);
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith('/login');
  });
});

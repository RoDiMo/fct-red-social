import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AutenticacionUsuariosService } from './autenticacion-usuarios.service';
import { LoggedInUser } from './auth';

describe('AutenticacionUsuariosService', () => {
  let service: AutenticacionUsuariosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutenticacionUsuariosService]
    });

    service = TestBed.inject(AutenticacionUsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in the user', () => {
    const username = 'testuser';
    const password = 'testpassword';

    service.logIn(username, password).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.token).toBeTruthy();
    });

    const request = httpMock.expectOne('http://localhost:8000/api-user-login/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username, password });

    request.flush({
      status: 200,
      body: {
        token: 'testtoken'
      }
    });
  });

  describe('setLoggedInUser', () => {
    it('should set user data in local storage if not already set', () => {
      const userData: LoggedInUser = {
        id: 1, username: 'testuser',
        token: ''
      };
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(localStorage, 'setItem');
      service.setLoggedInUser(userData);
      expect(localStorage.getItem).toHaveBeenCalledWith('userData');
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(userData));
    });

    it('should not set user data in local storage if already set', () => {
      const userData: LoggedInUser = {
        id: 1, username: 'testuser',
        token: ''
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userData));
      spyOn(localStorage, 'setItem');
      service.setLoggedInUser(userData);
      expect(localStorage.getItem).toHaveBeenCalledWith('userData');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getUsuarios', () => {
    it('should make an HTTP GET request to the registration API endpoint', () => {
      const httpMock = TestBed.inject(HttpTestingController);
      service.getUsuarios().subscribe();
      const req = httpMock.expectOne('http://localhost:8000/registro/');
      expect(req.request.method).toBe('GET');
    });
  });




});

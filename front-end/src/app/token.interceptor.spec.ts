import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });
    interceptor = TestBed.inject(TokenInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });

  
  it('should add authorization header with token if userData.token is present', () => {
    const userData = { token: 'TOKEN_VALUE' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userData));
    
    const dummyResponse = { /* ... */ };

    httpClient.get('/api/data').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Token ${userData.token}`);
    req.flush(dummyResponse);
  });

  it('should not add authorization header if userData.token is not present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const dummyResponse = { /* ... */ };

    httpClient.get('/api/data').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush(dummyResponse);
  });
});

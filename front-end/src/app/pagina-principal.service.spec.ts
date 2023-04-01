import { TestBed } from '@angular/core/testing';

import { PaginaPrincipalService } from './pagina-principal.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PaginaPrincipalService', () => {
  let service: PaginaPrincipalService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [PaginaPrincipalService]

    });
    service = TestBed.inject(PaginaPrincipalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return an Observable<any>', () => {
    const dummyData = { name: 'John Doe' };
    service.getUsuario().subscribe(data => {
      expect(data).toEqual(dummyData);
    });
    const request = httpMock.expectOne(service.url);
    expect(request.request.method).toBe('GET');
    request.flush(dummyData);
  });
});

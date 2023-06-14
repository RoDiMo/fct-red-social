import { TestBed } from '@angular/core/testing';

import { AmigosService } from './amigos.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AmigosService', () => {
  let service: AmigosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        ],
    });
    service = TestBed.inject(AmigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    httpMock = TestBed.inject(HttpTestingController);

  });




});









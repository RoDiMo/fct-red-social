import { TestBed } from '@angular/core/testing';

import { ObtenerDireccionService } from './obtener-direccion.service';

describe('ObtenerDireccionService', () => {
  let service: ObtenerDireccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerDireccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

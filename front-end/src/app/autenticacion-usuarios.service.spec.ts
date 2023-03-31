import { TestBed } from '@angular/core/testing';

import { AutenticacionUsuariosService } from './autenticacion-usuarios.service';

describe('AutenticacionUsuariosService', () => {
  let service: AutenticacionUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticacionUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

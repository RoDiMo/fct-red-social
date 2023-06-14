import { TestBed } from '@angular/core/testing';

import { PerfilUsuarioService } from './perfil-usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PerfilUsuarioService', () => {
  let service: PerfilUsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientTestingModule 
      ],
      providers: [ PerfilUsuarioService ]

    });
    service = TestBed.inject(PerfilUsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should return the user details when the id is valid', () => {
    const userId = '9';
    const userDetails = { id: userId, name: 'John Doe', email: 'john.doe@example.com' };

    service.getPerfilUsuario(userId).subscribe(data => {
      expect(data).toEqual(userDetails);
    });

    const req = httpMock.expectOne(`http://localhost:8000/usuarios/${userId}/`);
    expect(req.request.method).toBe('GET');
    req.flush(userDetails);

  });


  it('should get user by URL', () => {
    const url = 'http://localhost:8000/usuarios/4/';
    const dummyResponse = {
      /* ... */
    };

    service.getUsuario(url).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should edit user profile data', () => {
    const id = '4';
    const usuario = {
      /* ... */
    };
    const dummyResponse = {
      /* ... */
    };

    service.editarDatosPerfil(id, usuario).subscribe(response => {

    });

    const req = httpMock.expectOne(service.url + `${id}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(usuario);
    req.flush(dummyResponse);
  });

  it('should get chat partners data', () => {
    const idEmisor = '1';
    const idReceptor = '2';
    const dummyResponse = {
      /* ... */
    };

    service.obtenerParejaChat(idEmisor, idReceptor).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(service.url + `obtener_pareja_usuarios/?id=${idEmisor}&id=${idReceptor}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

});

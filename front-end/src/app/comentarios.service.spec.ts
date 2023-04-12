import { TestBed } from '@angular/core/testing';

import { ComentariosService } from './comentarios.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController,HttpClientTestingModule} from '@angular/common/http/testing';
import { Comentario } from './comentario/comentario';

describe('ComentariosService', () => {
  let service: ComentariosService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        

        ],
        providers: [ComentariosService],
    });
    service = TestBed.inject(ComentariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('debería enviar un comentario', () => {
    const comentario: any = {id: 1, texto: 'Este es un comentario.'};
    service.nuevoComentario(comentario).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.id).toBe(1);
      expect(response.texto).toBe('Este es un comentario.');
    });

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toEqual('POST');
    req.flush(comentario);
  });

});

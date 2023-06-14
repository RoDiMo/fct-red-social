import { TestBed } from '@angular/core/testing';

import { NotificacionesService } from './notificaciones.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, 
        HttpClientTestingModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ],
    });
    service = TestBed.inject(NotificacionesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should create a new notification', () => {
    const notificacion = {
      url: 'http://localhost:8000/notificacionesamistad/1/',
      id: 1,
      usuario_origen: 'http://localhost:8000/usuarios/6/',
      usuario_destino: 'http://localhost:8000/usuarios/2/',
      estado: 'Aceptada',
      fecha_notificacion: '2023-05-17T11:39:46.018000+02:00',
      procesada: true
    };

    const dummyResponse = {
      /* ... */
    };

    service.nuevaNotificacion(notificacion).subscribe(response => {
 
    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(notificacion);
    req.flush(dummyResponse);
  });

  it('should get notifications by user destination', () => {
    const idUsuario = 2;
    const dummyResponse = {
      /* ... */
    };

    service.obtenerNotificacionesUsuarioDestino(idUsuario).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url + `?usuario_destino=${idUsuario}&procesada=false`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should get notifications by user origin', () => {
    const idUsuario = 6;
    const dummyResponse = {
      /* ... */
    };

    service.obtenerNotificacionesUsuarioOrigen(idUsuario).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url + `?usuario_origen=${idUsuario}&procesada=false`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should get notifications by user origin and destination', () => {
    const idUsuarioO = 6;
    const idUsuarioD = 2;
    const dummyResponse = {
      /* ... */
    };

    service.obtenerNotificacionesUsuarioOrigenDestino(idUsuarioO, idUsuarioD).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url + `?usuario_origen=${idUsuarioO}&usuario_destino=${idUsuarioD}&procesada=false`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should get notification by ID', () => {
    const idNotificacion = 1;
    const dummyResponse = {
      /* ... */
    };

    service.obtenerNotificacionPorId(idNotificacion).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url + `${idNotificacion}/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should update a notification', () => {
    const idNotificacion = 1;
    const notificacion = {
      url: 'http://localhost:8000/notificacionesamistad/1/',
      id: 1,
      usuario_origen: 'http://localhost:8000/usuarios/6/',
      usuario_destino: 'http://localhost:8000/usuarios/2/',
      estado: 'Aceptada',
      fecha_notificacion: '2023-05-17T11:39:46.018000+02:00',
      procesada: true
    };
    const dummyResponse = {
      /* ... */
    };

    service.actualizarNotificacion(idNotificacion, notificacion).subscribe(response => {
     
    });

    const req = httpTestingController.expectOne(service.url + `${idNotificacion}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(notificacion);
    req.flush(dummyResponse);
  });
});

import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';

describe('ChatService', () => {
  let service: ChatService;
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
        providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should retrieve chat messages between two users', () => {
    const idEmisor = '1';
    const idReceptor = '2';
    const dummyResponse = { /* ... */ };

    service.obtenerMensajesChat(idEmisor, idReceptor).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service.url}mensajes_chat/?emisor=${idEmisor}&receptor=${idReceptor}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should retrieve unread messages between two users', () => {
    const idEmisor = '1';
    const idReceptor = '2';
    const dummyResponse = { /* ... */ };

    service.obtenerMensajesNoLeidos(idEmisor, idReceptor).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service.url}mensajes_no_leidos/?emisor=${idEmisor}&receptor=${idReceptor}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should update a message', () => {
    const idMensaje = '1';
    const mensaje = { /* ... */ };
    const dummyResponse = { /* ... */ };

    service.actualizarMensaje(idMensaje, mensaje).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service.url}${idMensaje}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mensaje);
    req.flush(dummyResponse);
  });

  it('should create a new message', () => {
    const mensaje = {
      url: 'http://localhost:8000/chat/133/',
      id: 133,
      emisor: 'http://localhost:8000/usuarios/1/',
      receptor: 'http://localhost:8000/usuarios/2/',
      fecha_mensaje: '2023-06-07T11:32:22.319113+02:00',
      leido: true,
      mensaje: 'd'
    };
    const dummyResponse = mensaje;

    service.nuevoMensaje(mensaje).subscribe(response => {

    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mensaje);

    req.flush(dummyResponse); // Proporciona el cuerpo de respuesta en la simulación

    // Asegúrate de que la suscripción se haya completado correctamente
    expect(service).toBeTruthy();
  });
});

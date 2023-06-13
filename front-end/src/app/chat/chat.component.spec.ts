import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { of } from 'rxjs';
import { ChatService } from '../chat.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: ChatService;
  let perfilUsuarioService: PerfilUsuarioService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent, CabeceraComponent, ContactosChatComponent ],
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
        providers: [ChatService, PerfilUsuarioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
        chatService = TestBed.inject(ChatService); // Obtener una instancia del servicio ChatService
        perfilUsuarioService = TestBed.inject(PerfilUsuarioService); // Obtener una instancia del servicio PerfilUsuarioService

    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerMensajesNoLeidos and actualizarVisto on obtenerMensajesNoLeidos', () => {
    // Establece valores de prueba para el componente
    component.credenciales = { id: '123' };
    component.idAmigo = '456';

    // Espía el método obtenerMensajesNoLeidos del servicio ChatService
    const obtenerMensajesNoLeidosSpy = spyOn(chatService, 'obtenerMensajesNoLeidos').and.returnValue(of([]));

    // Espía el método actualizarVisto del componente
    const actualizarVistoSpy = spyOn(component, 'actualizarVisto');

    // Llama al método obtenerMensajesNoLeidos del componente
    component.obtenerMensajesNoLeidos();

    // Comprueba que se llame a obtenerMensajesNoLeidos y actualizarVisto
    expect(obtenerMensajesNoLeidosSpy).toHaveBeenCalled();
    expect(actualizarVistoSpy).toHaveBeenCalled();
  });


  
  it('should call getPerfilUsuario for logged-in user and friend', () => {
    // Establece valores de prueba para el componente
    component.credenciales = { id: '123' };
    component.idAmigo = '456';

    // Espía los métodos getPerfilUsuario del servicio PerfilUsuarioService
    const getPerfilUsuarioSpy = spyOn(perfilUsuarioService, 'getPerfilUsuario').and.returnValue(of({}));

    // Llama al método obtenerMensajesNoLeidos del componente
    component.obtenerParUsuarios();

    // Comprueba que se llame a getPerfilUsuario para el usuario logueado y el amigo
    expect(getPerfilUsuarioSpy).toHaveBeenCalledWith('123');
    expect(getPerfilUsuarioSpy).toHaveBeenCalledWith('456');
  });


  
  it('should call obtenerMensajesChat', () => {
    // Establece valores de prueba para el componente
    component.credenciales = { id: '123' };
    component.idAmigo = '456';

    // Espía el método obtenerMensajesChat del servicio ChatService
    const obtenerMensajesChatSpy = spyOn(chatService, 'obtenerMensajesChat').and.returnValue(of([]));

    // Llama al método obtenerMensajes del componente
    component.obtenerMensajes();

    // Comprueba que se llame a obtenerMensajesChat con los valores adecuados
    expect(obtenerMensajesChatSpy).toHaveBeenCalledWith('123', '456');
  });


  it('should update messages to "leidos"', () => {
    // Crea mensajes de prueba
    const mensajes = [
      { id: '1', leido: false },
      { id: '2', leido: false },
      { id: '3', leido: false }
    ];

    // Espía el método actualizarMensaje del servicio ChatService
    const actualizarMensajeSpy = spyOn(chatService, 'actualizarMensaje').and.returnValue(of({}));

    // Llama al método actualizarVisto del componente
    component.actualizarVisto(mensajes);

    // Comprueba que se haya llamado a actualizarMensaje por cada mensaje
    expect(actualizarMensajeSpy).toHaveBeenCalledTimes(mensajes.length);

    // Comprueba que se haya llamado a actualizarMensaje con los mensajes correctos
    mensajes.forEach((mensaje, index) => {
      expect(actualizarMensajeSpy).toHaveBeenCalledWith(mensaje.id, { id: mensaje.id, leido: true });
    });
  });



});

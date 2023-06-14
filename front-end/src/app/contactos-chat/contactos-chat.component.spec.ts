import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosChatComponent } from './contactos-chat.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { of } from 'rxjs';
import { AmigosChat } from '../amigos/amigo';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';

describe('ContactosChatComponent', () => {
  let component: ContactosChatComponent;
  let fixture: ComponentFixture<ContactosChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactosChatComponent, CabeceraComponent ],
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the value of altoVentana on window resize', () => {
    const newHeight = 800;
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(newHeight);
  
    component.onWindowResize();
  
    expect(component.altoVentana).toBe(newHeight);
  });
  
  it('should get the logged-in user and call obtenerAmistades() on gestionarUsuarios', () => {
    const usuarioRegistrado = {
      id: '1',
      username: 'user1',
      password: 'password1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      telefono: '123456789',
      es_moderador: true,
      is_staff: true,
      pais: 'Country 1',
      estado: 'State 1',
      ciudad: 'City 1',
      direccion: 'Address 1',
      foto_perfil: '',
      url: 'user1-url',
      amistadPendiente: false,
      fecha_alta: new Date()
    };
    const amistades = ['friend1', 'friend2'];
  
    spyOn(component._obtenerUsuarioService, 'getUsuario').and.returnValue(of(usuarioRegistrado));
    spyOn(component, 'obtenerAmistades');
  
    component.gestionarUsuarios();
  
    expect(component._obtenerUsuarioService.getUsuario).toHaveBeenCalledWith(component.credenciales.id);
    expect(component.usuarioRegistrado).toEqual(usuarioRegistrado);
    expect(component.obtenerAmistades).toHaveBeenCalled();
  });


  it('should retrieve user friends and update unread message count', () => {
    const usuarioRegistrado = {
      id: '1',
      username: 'user1',
      password: 'password1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      telefono: '123456789',
      es_moderador: true,
      is_staff: true,
      pais: 'Country 1',
      estado: 'State 1',
      ciudad: 'City 1',
      direccion: 'Address 1',
      foto_perfil: '',
      url: 'user1-url',
      amistadPendiente: false,
      fecha_alta: new Date()
    }

    const usuario1 = new PerfilUsuario(     '1',
    'usuario1',
    'contraseña1',
    'Nombre1',
    'Apellido1',
    'usuario1@example.com',
    '123456789',
    true,
    false,
    'País1',
    'Estado1',
    'Ciudad1',
    'Dirección1',
    null, // Coloca aquí la foto de perfil de ejemplo o deja null si no es relevante para la prueba
    'https://example.com/usuario1',
    false,
    new Date(),)


    const usuario2 = new PerfilUsuario(     '1',
    'usuario1',
    'contraseña1',
    'Nombre1',
    'Apellido1',
    'usuario1@example.com',
    '123456789',
    true,
    false,
    'País1',
    'Estado1',
    'Ciudad1',
    'Dirección1',
    null, // Coloca aquí la foto de perfil de ejemplo o deja null si no es relevante para la prueba
    'https://example.com/usuario1',
    false,
    new Date(),)
    const usuariosAmigos = [new AmigosChat('id1', usuario1, usuario2)];
    
    
    const numMensajes = [1, 2];
  
    spyOn(component._amigosService, 'obtenerAmistades').and.returnValue(of({ results: usuariosAmigos }));
    spyOn(component._chatService, 'obtenerMensajesNoLeidos').and.returnValues(
      of(numMensajes[0]),
      of(numMensajes[1])
    );
    spyOn(component.location, 'path').and.returnValue(`/chat/${usuariosAmigos[0].datos_usuario_receptor.id}`);
  
    component.usuarioRegistrado = usuarioRegistrado;
  
    component.obtenerAmistades();
  
    expect(component._amigosService.obtenerAmistades).toHaveBeenCalledWith(usuarioRegistrado.id);
    expect(component.usuariosAmigos).toEqual(usuariosAmigos);
    expect(component._chatService.obtenerMensajesNoLeidos).toHaveBeenCalledTimes(1);

    expect(component.location.path).toHaveBeenCalled();
    expect(component.usuariosAmigos[0].numMensajesNoLeidos).toBe('0');
  });
});

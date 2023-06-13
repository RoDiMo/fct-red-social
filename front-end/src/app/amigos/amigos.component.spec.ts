import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmigosComponent } from './amigos.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { Amigo, AmigosChat } from './amigo';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { AmigosService } from '../amigos.service';
import { NotificacionesService } from '../notificaciones.service';

describe('AmigosComponent', () => {
  let component: AmigosComponent;
  let fixture: ComponentFixture<AmigosComponent>;
  let location: Location;
  let authService: AutenticacionUsuariosService;
  let amigosService: AmigosService;
  let notificacionesService: NotificacionesService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ AmigosComponent, CabeceraComponent, ContactosChatComponent ],
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
        providers: [ AmigosService, NotificacionesService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
    authService = TestBed.inject(AutenticacionUsuariosService);
    amigosService = TestBed.inject(AmigosService);
    notificacionesService = TestBed.inject(NotificacionesService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  describe('Amigo', () => {
    it('should create an instance', () => {
      const amigo = new Amigo('usuario1', 'usuario2', new Date());
      expect(amigo).toBeTruthy();
      expect(amigo.usuario_solicitante).toEqual('usuario1');
      expect(amigo.usuario_receptor).toEqual('usuario2');
      expect(amigo.fecha_creacion).toEqual(jasmine.any(Date));
    });
  });
  

  
  describe('AmigosChat', () => {
    it('should create an instance', () => {
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


      const amigoChat = new AmigosChat('id1', usuario1, usuario2);
      expect(amigoChat).toBeTruthy();
      expect(amigoChat.id).toEqual('id1');
      expect(amigoChat.datos_usuario_solicitante).toEqual(jasmine.any(PerfilUsuario));
      expect(amigoChat.datos_usuario_receptor).toEqual(jasmine.any(PerfilUsuario));
      expect(amigoChat.numMensajesNoLeidos).toEqual('0');
    });
  });


  it('should get user', () => {
    const id = '1'; // ID de usuario a consultar
    const usuario =  new PerfilUsuario(     '1',
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
    new Date(),); // Datos de ejemplo del usuario
    spyOn(authService, 'getUsuario').and.returnValue(of(usuario)); // Espía el método getUsuario y retorna un Observable con los datos del usuario

    component.obtenerUsuarioRegistrado();

  
    expect(component.usuarioRegistrado).toEqual([usuario]);
  });




  it('should get friends', () => {
    const amigos = [ new PerfilUsuario(     '1',
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
    new Date())
   ]; // Datos de ejemplo de amigos
    spyOn(amigosService, 'obtenerAmigos').and.returnValue(of(amigos)); // Espía el método obtenerAmigos y retorna un Observable con los datos de los amigos

    component.obtenerAmigos();

    expect(amigosService.obtenerAmigos).toHaveBeenCalled();
    expect(component.amigos).toEqual(amigos);
  });



  it('should get no amigos and check notifications', () => {
    const noAmigos = [  new PerfilUsuario(     '1',
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
    new Date())]; // Datos de ejemplo de no amigos
    const notificaciones = [ { id: '1', mensaje: 'Solicitud de amistad' } ]; // Datos de ejemplo de notificaciones

    spyOn(amigosService, 'noAmigos').and.returnValue(of(noAmigos)); // Espía el método noAmigos y retorna un Observable con los datos de los no amigos
    spyOn(notificacionesService, 'obtenerNotificacionesUsuarioOrigenDestino').and.returnValue(of(notificaciones)); // Espía el método obtenerNotificacionesUsuarioOrigenDestino y retorna un Observable con las notificaciones

    component.obtenerNoAmigos();

    expect(amigosService.noAmigos).toHaveBeenCalled();
    expect(component.noAmigos).toEqual(noAmigos);

    expect(notificacionesService.obtenerNotificacionesUsuarioOrigenDestino).toHaveBeenCalled();
    expect(component.noAmigos[0].amistadPendiente).toBe(true);
  });


  it('should add amigo and reload page', () => {
    const amigoUrl = 'https://example.com/amigo'; // URL de ejemplo del amigo

    spyOn(notificacionesService, 'nuevaNotificacion').and.returnValue(of({ status: 201 })); // Espía el método nuevaNotificacion y retorna un Observable con el estado de respuesta



    component.agregarAmigo(amigoUrl);

    expect(notificacionesService.nuevaNotificacion).toHaveBeenCalled();

  });



  it('should delete amistad and reload page', () => {
    const amigoId = '123'; // ID de amigo de ejemplo

    const amistadData = { results: [{ url: 'https://example.com/amistad' }] }; // Datos de amistad de ejemplo
    const amistadCanceladaData = { /* datos de amistad cancelada de ejemplo */ }; // Datos de amistad cancelada de ejemplo
    const eliminacionData = { status: 204 }; // Datos de eliminación de amistad de ejemplo

    spyOn(amigosService, 'obtenerAmistad').and.returnValue(of(amistadData)); // Espía el método obtenerAmistad y retorna un Observable con los datos de amistad de ejemplo
    spyOn(amigosService, 'eliminarAmigo').and.returnValues(of(eliminacionData), of(eliminacionData)); // Espía el método eliminarAmigo y retorna Observables con los datos de eliminación de amistad de ejemplo

    component.eliminarAmistad(amigoId);

    expect(amigosService.obtenerAmistad).toHaveBeenCalled();
    expect(amigosService.eliminarAmigo).toHaveBeenCalled();
    expect(amigosService.eliminarAmigo).toHaveBeenCalledTimes(2);

  });

});






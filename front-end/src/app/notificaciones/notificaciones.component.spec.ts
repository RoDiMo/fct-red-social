import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NotificacionesComponent } from './notificaciones.component';
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
import { of } from 'rxjs';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { NotificacionesService } from '../notificaciones.service';
import { AmigosService } from '../amigos.service';
import { Notificacion } from './notificaciones';
import { Amigo } from '../amigos/amigo';

describe('NotificacionesComponent', () => {
  let component: NotificacionesComponent;
  let fixture: ComponentFixture<NotificacionesComponent>;
  let notificacionesService: NotificacionesService;
  let autenticacionService: AutenticacionUsuariosService;
  let amigosService: AmigosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesComponent, CabeceraComponent, ContactosChatComponent ],
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
        providers: [ NotificacionesService, AutenticacionUsuariosService, AmigosService  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesComponent);
    component = fixture.componentInstance;

    notificacionesService = TestBed.inject(NotificacionesService);
    autenticacionService = TestBed.inject(AutenticacionUsuariosService);
    amigosService = TestBed.inject(AmigosService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call obtenerNotificacionesUsuarioDestino and getUsuarioUrl', () => {
    const idUsuario = '123';
    const notificacionUsuarioDestino = {
      usuario_origen: '456',
      nombre_usuario: ''
    };
    const usuarioData = { username: 'JohnDoe' };

    spyOn(autenticacionService, 'obtenerCredenciales').and.returnValue({ id: idUsuario });
    spyOn(notificacionesService, 'obtenerNotificacionesUsuarioDestino').and.returnValue(of({ results: [notificacionUsuarioDestino] }));
    spyOn(autenticacionService, 'getUsuarioUrl').and.returnValue(of(usuarioData));

    component.obtenerNotificaciones();

   
    expect(autenticacionService.getUsuarioUrl).toHaveBeenCalledWith(notificacionUsuarioDestino.usuario_origen);
    expect(notificacionUsuarioDestino.nombre_usuario).toBe(usuarioData.username);
  });

/*
  it('should call nuevaAmistad, obtenerNotificacionPorId, and actualizarNotificacion', () => {
    const idNotificacion = '123';
    const usuarioOrigen = '456';
    const usuarioDestino = '789';

    const usuarioEmisor = { usuario_origen: usuarioOrigen, usuario_destino: usuarioDestino, fecha: '2023-06-14' };
    const usuarioReceptor = { usuario_origen: usuarioDestino, usuario_destino: usuarioOrigen, fecha: '2023-06-14' };
    const notificacionActualizada = { estado: 'Aceptada', procesada: true };

    spyOn(amigosService, 'nuevaAmistad').and.returnValue(of(null));
    spyOn(notificacionesService, 'obtenerNotificacionPorId').and.returnValue(of(notificacionActualizada));
    spyOn(notificacionesService, 'actualizarNotificacion').and.returnValue(of({ status: 200 }));
    spyOn(component, 'ngOnInit').and.stub();

    component.confirmarAmistad(idNotificacion, usuarioOrigen, usuarioDestino);

    expect(amigosService.nuevaAmistad).toHaveBeenCalledTimes(2);
   

    expect(notificacionesService.obtenerNotificacionPorId).toHaveBeenCalledWith(idNotificacion);

    expect(notificacionesService.actualizarNotificacion).toHaveBeenCalledWith(idNotificacion, notificacionActualizada);

  });
*/

  it('should call obtenerNotificacionPorId and actualizarNotificacion', () => {
    const idNotificacion = '123';
    const notificacionActualizada = { estado: 'Rechazada', procesada: true };

    spyOn(notificacionesService, 'obtenerNotificacionPorId').and.returnValue(of(notificacionActualizada));
    spyOn(notificacionesService, 'actualizarNotificacion').and.returnValue(of({ status: 200 }));
    spyOn(component, 'ngOnInit').and.stub();

    component.rechazarAmistad(idNotificacion);

    expect(notificacionesService.obtenerNotificacionPorId).toHaveBeenCalledWith(idNotificacion);

    expect(notificacionesService.actualizarNotificacion).toHaveBeenCalledWith(idNotificacion, notificacionActualizada);

    expect(component.ngOnInit).toHaveBeenCalled();
  });



  describe('Notificacion', () => {
    it('should create an instance', () => {
      const id: string | null = '1';
      const usuario_origen: string = 'JohnDoe';
      const usuario_destino: string = 'JaneDoe';
      const estado: string = 'Pendiente';
      const fecha_notificacion: Date = new Date();
      const procesada: boolean = false;
      const nombre_usuario: string | null = null;
  
      const notificacion = new Notificacion(
        id,
        usuario_origen,
        usuario_destino,
        estado,
        fecha_notificacion,
        procesada,
        nombre_usuario
      );
  
      expect(notificacion).toBeTruthy();
      expect(notificacion.id).toBe(id);
      expect(notificacion.usuario_origen).toBe(usuario_origen);
      expect(notificacion.usuario_destino).toBe(usuario_destino);
      expect(notificacion.estado).toBe(estado);
      expect(notificacion.fecha_notificacion).toBe(fecha_notificacion);
      expect(notificacion.procesada).toBe(procesada);
      expect(notificacion.nombre_usuario).toBe(nombre_usuario);
    });
  });



  it('should confirm friendship', fakeAsync(() => {
    const idNotificacion = '1';
    const usuarioOrigen = 'JohnDoe';
    const usuarioDestino = 'JaneDoe';

    const amistadEmisor = new Amigo(usuarioOrigen, usuarioDestino, new Date());
    const amistadReceptor = new Amigo(usuarioDestino, usuarioOrigen, new Date());

    const obtenerNotificacionSpy = spyOn(notificacionesService, 'obtenerNotificacionPorId').and.returnValue(
      of(new Notificacion(idNotificacion, usuarioOrigen, usuarioDestino, 'Pendiente', new Date(), false, null))
    );

    const actualizarNotificacionSpy = spyOn(notificacionesService, 'actualizarNotificacion').and.returnValue(
      of({ status: 200 })
    );

    const nuevaAmistadSpy = spyOn(amigosService, 'nuevaAmistad').and.returnValue(
      of({})
    );

    component.confirmarAmistad(idNotificacion, usuarioOrigen, usuarioDestino);

    tick();

    expect(obtenerNotificacionSpy).toHaveBeenCalledWith(idNotificacion);
    expect(actualizarNotificacionSpy).toHaveBeenCalledWith(idNotificacion, jasmine.any(Notificacion));
    expect(nuevaAmistadSpy).toHaveBeenCalledTimes(2);
  }));
});

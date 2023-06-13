import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CabeceraComponent } from './cabecera.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AmigosService } from '../amigos.service';
import { NotificacionesService } from '../notificaciones.service';
import { ChatService } from '../chat.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ContactosChatModalComponent } from '../contactos-chat-modal/contactos-chat-modal.component';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

describe('CabeceraComponent', () => {
  let component: CabeceraComponent;
  let fixture: ComponentFixture<CabeceraComponent>;
  let autenticacionUsuariosService: AutenticacionUsuariosService;
  let perfilUsuarioService: PerfilUsuarioService;
  let amigosService: AmigosService;
  let notificacionesService: NotificacionesService;
  let chatService: ChatService;
  let modal: NgbModal;
  let autenticacionService: AutenticacionUsuariosService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabeceraComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AutenticacionUsuariosService,
        PerfilUsuarioService,
        AmigosService,
        NotificacionesService,
        ChatService,
        NgbModal,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabeceraComponent);
    component = fixture.componentInstance;
    autenticacionUsuariosService = TestBed.inject(AutenticacionUsuariosService);
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
    amigosService = TestBed.inject(AmigosService);
    notificacionesService = TestBed.inject(NotificacionesService);
    chatService = TestBed.inject(ChatService);
    modal = TestBed.inject(NgbModal);
    autenticacionService = TestBed.inject(AutenticacionUsuariosService);
    router = TestBed.inject(Router);

    spyOn(autenticacionUsuariosService, 'obtenerCredenciales').and.returnValue({
      id: '1',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerUsuarioRegistrado on ngOnInit', () => {
    spyOn(component, 'obtenerUsuarioRegistrado');
    fixture.detectChanges();

    // Asignar un valor a this.credenciales
    component.credenciales = { id: '1' }; // Puedes ajustar el valor según tus necesidades

    // Volver a llamar a fixture.detectChanges() para que se apliquen los cambios
    fixture.detectChanges();

    expect(component.obtenerUsuarioRegistrado).toHaveBeenCalled();
  });


  it('should update altoVentana on window resize', () => {
    const mockHeight = 500; // Altura de ventana de ejemplo

    // Simular un cambio en la altura de la ventana
    spyOnProperty(window, 'innerHeight').and.returnValue(mockHeight);
    component.onWindowResize();

    expect(component.altoVentana).toEqual(mockHeight);
  });


  it('debería obtener el usuario y configurar esAdmin en true si el usuario es administrador o moderador', () => {
    const usuario = { 
      id: '2',
      username: 'user2',
      password: 'password2',
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
    spyOn(autenticacionService, 'getUsuario').and.returnValue(of(usuario));

    component.ngOnInit();

    expect(component.datosUsuario).toEqual(usuario);
    expect(component.esAdmin).toBeTrue();
  });

  it('debería obtener el usuario y configurar esAdmin en true si el usuario es moderador', () => {
    const usuario = {   id: '2',
    username: 'user2',
    password: 'password2',
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
    fecha_alta: new Date() };
    spyOn(autenticacionService, 'getUsuario').and.returnValue(of(usuario));

    component.ngOnInit();

    expect(component.datosUsuario).toEqual(usuario);
    expect(component.esAdmin).toBeTrue();
  });

  it('debería obtener el usuario y configurar esAdmin en false si el usuario no es administrador ni moderador', () => {
    const usuario = {   id: '2',
    username: 'user2',
    password: 'password2',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    telefono: '123456789',
    es_moderador: false,
    is_staff: false,
    pais: 'Country 1',
    estado: 'State 1',
    ciudad: 'City 1',
    direccion: 'Address 1',
    foto_perfil: '',
    url: 'user1-url',
    amistadPendiente: false,
    fecha_alta: new Date() };
    spyOn(autenticacionService, 'getUsuario').and.returnValue(of(usuario));

    component.ngOnInit();

    expect(component.datosUsuario).toEqual(usuario);
    expect(component.esAdmin).toBeFalse();
  });



  it('debería obtener las amistades y configurar el número de mensajes no leídos', () => {
    const datosUsuario = {
      id: '2',
      username: 'user2',
      password: 'password2',
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
    const usuariosAmigos = [
      {
        id: '1',
        datos_usuario_solicitante: {
          id: '2',
          username: 'user2',
          password: 'password2',
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
        },
        datos_usuario_receptor:{
          id: '2',
          username: 'user2',
          password: 'password2',
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
        },
        numMensajesNoLeidos: '0'

      },
    ];

    
    const noLeidos = [{}]
    const numMensajes = ['1', '2', '0'];

    spyOn(amigosService, 'obtenerAmistades').and.returnValue(of({ results: usuariosAmigos }));
    spyOn(chatService, 'obtenerMensajesNoLeidos').and.returnValues(
      of(numMensajes.slice(0, 1)),
      of(numMensajes.slice(1))
    );
    component.datosUsuario = datosUsuario;
    
    component.obtenerAmistades();


    spyOn(component.location, 'path').and.returnValue(`/chat/${usuariosAmigos[0].datos_usuario_solicitante}`);


    expect(component.usuariosAmigos).toEqual(usuariosAmigos);
    expect(usuariosAmigos[0].numMensajesNoLeidos.toString()).toEqual(numMensajes[0].toString());    
  });


  it('debería realizar el logout y redirigir a la página de login', () => {
    // Espía el método "removeItem" de localStorage
    const removeItemSpy = spyOn(localStorage, 'removeItem');

    // Espía el método "navigateByUrl" de router
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    // Llama al método a probar
    component.logout();

    // Comprueba que se llame a "removeItem" con los argumentos correctos
    expect(removeItemSpy).toHaveBeenCalledWith('userData');
    expect(removeItemSpy).toHaveBeenCalledWith('enlace-cabecera');

    // Comprueba que se llame a "navigateByUrl" con el argumento correcto
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
  });
});








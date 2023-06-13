import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsuariosComponent } from './admin-usuarios.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { of } from 'rxjs';
import { AdminService } from '../admin.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';

describe('AdminUsuariosComponent', () => {
  let component: AdminUsuariosComponent;
  let fixture: ComponentFixture<AdminUsuariosComponent>;
  let router: Router;
  let usuarioService: AutenticacionUsuariosService;
  let adminService: AdminService;
  let postService: PaginaPrincipalService;
  let perfilUsuarioService: PerfilUsuarioService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUsuariosComponent, CabeceraComponent, ContactosChatComponent],
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
      providers: [
        AutenticacionUsuariosService,
        AdminService,
        PerfilUsuarioService,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminUsuariosComponent);
    usuarioService = TestBed.inject(AutenticacionUsuariosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    adminService = TestBed.inject(AdminService);
    postService = TestBed.inject(PaginaPrincipalService);
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);

 
      

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to "/"', () => {
    spyOn(router, 'navigate');

    component.enlaceAplicacion();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });


  it('should redirect to "/" if user does not have admin privileges', () => {
    spyOn(usuarioService, 'getUsuario').and.returnValue(of({ es_moderador: false, is_staff: false }));
    spyOn(router, 'navigate');

    component.obtenerUsuarioRegistrado();

    expect(usuarioService.getUsuario).toHaveBeenCalledWith(component.credenciales?.id);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not redirect if user has admin privileges', () => {
    spyOn(usuarioService, 'getUsuario').and.returnValue(of({ es_moderador: true, is_staff: true }));
    spyOn(router, 'navigate');

    component.obtenerUsuarioRegistrado();

    expect(usuarioService.getUsuario).toHaveBeenCalledWith(component.credenciales?.id);
    expect(router.navigate).not.toHaveBeenCalled();
  });



  it('should set contenidoCargado to true after 500ms', (done) => {
    spyOn(window, 'setTimeout').and.callThrough(); // Espía la función setTimeout

    // Ejecuta la función que contiene el setTimeout
    component.ngOnInit();

    setTimeout(() => {
      expect(component.contenidoCargado).toBeTrue(); // Verifica que contenidoCargado sea true
      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 500); // Verifica que se haya llamado setTimeout con los parámetros correctos
      done();
    }, 500);
  });



  it('should order users in ascending order by the specified field', () => {
    const campo = 'username';
    const usuariosOrdenados = [
      {
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
      },
    ];

    spyOn(adminService, 'ordenarUsuarios').and.returnValue(of({ results: usuariosOrdenados })); 

    component.ordenarUsuarios(campo);

    expect(component.campoSeleccionado).toBe(campo);
    expect(component.ordenarCampo).toBe(true);

    expect(component.usuarios).toEqual(usuariosOrdenados);
  });

  it('should order users in descending order by the specified field', () => {
    const campo = 'username';
    const usuariosOrdenados = [

      {
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
      },

      {
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

    ];

    spyOn(adminService, 'ordenarUsuarios').and.returnValue(of({ results: usuariosOrdenados }));

    component.ordenarCampo = false; // Establecer ordenarCampo en false
    component.ordenarUsuarios(campo);

    expect(component.campoSeleccionado).toBe(campo);
    expect(component.ordenarCampo).toBe(true); // Verificar que ordenarCampo se haya invertido

    expect(component.usuarios).toEqual(usuariosOrdenados);
  });  


  it('should get users ordered by username', () => {
    const usuariosOrdenados = [
      {
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
      },
      // ...otros usuarios
    ];

    spyOn(adminService, 'ordenarUsuarios').and.returnValue(of({ results: usuariosOrdenados }));

    component.obtenerUsuarios();

    expect(adminService.ordenarUsuarios).toHaveBeenCalledWith('username', '', component.fecha_inicio, component.fecha_fin);
    expect(component.usuarios).toEqual(usuariosOrdenados);
  });

  it('should get posts ordered by publication date', () => {
    const postsOrdenados = [
      {
        url: '',
        id: '1',
        titulo: 'Post 1',
        contenido: 'Contenido del post 1',
        imagen: '',
        usuario: 'Usuario 1',
        num_likes: 10,
        num_visitas: 50,
        num_comentarios: 5,
        fecha_publicacion: new Date('2023-06-01'),
        likeDado: false,
        nombre_usuario: 'Nombre de Usuario 1',
        foto_perfil: '',
        creador: true,
        datos_usuario: {
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
        }, // Aquí debes asignar el objeto de tipo PerfilUsuario correspondiente
        oculto: false
      },

    ];

    spyOn(postService, 'getPost').and.returnValue(of({ results: postsOrdenados }));

    component.obtenerPost();

    expect(postService.getPost).toHaveBeenCalled();
    expect(component.posts).toEqual(postsOrdenados);
  });


  it('should order users and update usuarios array', () => {
    const campoSeleccionado = 'nombre';
    const valorBusqueda = 'example';
    const fecha_inicio = '2023-05-19';
    const fecha_fin = '';
  
    const ordenarUsuariosResponse = {
      results: [{
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
      }]
    };
  
    spyOn(component._adminService, 'ordenarUsuarios').and.returnValue(of(ordenarUsuariosResponse));
  
    component.campoSeleccionado = campoSeleccionado;
    component.ordenarCampo = false;
    component.valorBusqueda = valorBusqueda;
    component.fecha_inicio = fecha_inicio;
    component.fecha_fin = fecha_fin;
  
    component.guardarValorBusqueda();
  
    expect(component._adminService.ordenarUsuarios).toHaveBeenCalledWith(campoSeleccionado, valorBusqueda, fecha_inicio, fecha_fin);
    expect(component.usuarios).toEqual(ordenarUsuariosResponse.results);
  });
  


  it('should order users and update usuarios array', () => {
    const campoSeleccionado = 'nombre';
    const valorBusqueda = 'example';
    const fecha_inicio = '2023-05-19';
    const fecha_fin = '';
  
    const ordenarUsuariosResponse = {
      results: [{
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
      }]
    };
  
    spyOn(component._adminService, 'ordenarUsuarios').and.returnValue(of(ordenarUsuariosResponse));
  
    component.campoSeleccionado = campoSeleccionado;
    component.ordenarCampo = true;
    component.valorBusqueda = valorBusqueda;
    component.fecha_inicio = fecha_inicio;
    component.fecha_fin = fecha_fin;
  
    component.guardarValorBusqueda();
  
    expect(component._adminService.ordenarUsuarios).toHaveBeenCalledWith('-'+campoSeleccionado, valorBusqueda, fecha_inicio, fecha_fin);
    expect(component.usuarios).toEqual(ordenarUsuariosResponse.results);
  });



  it('should add moderator', () => {
    const id = '123';
    const usuario = new PerfilUsuario(
      '1',
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
      new Date(),
    );

    spyOn(component.usuarioModerador, 'patchValue');
    spyOn(component._editarUsuario, 'editarDatosPerfil').and.returnValue(of({ status: 200 }));
    spyOn(component, 'guardarValorBusqueda');

    component.agregarModerador(id, usuario);

    expect(component.usuarioModerador.patchValue).toHaveBeenCalledWith({ es_moderador: true });
    expect(component._editarUsuario.editarDatosPerfil).toHaveBeenCalledWith(id, component.usuarioModerador.value);
    expect(component.guardarValorBusqueda).toHaveBeenCalled();
  });



  it('should delete moderator', () => {
    const id = '123';
    const usuario = new PerfilUsuario(
      '1',
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
      new Date(),
    );

    spyOn(component.usuarioModerador, 'patchValue');
    spyOn(component._editarUsuario, 'editarDatosPerfil').and.returnValue(of({ status: 200 }));
    spyOn(component, 'guardarValorBusqueda');

    component.quitarModerador(id, usuario);

    expect(component.usuarioModerador.patchValue).toHaveBeenCalledWith({ es_moderador: false });
    expect(component._editarUsuario.editarDatosPerfil).toHaveBeenCalledWith(id, component.usuarioModerador.value);
    expect(component.guardarValorBusqueda).toHaveBeenCalled();
  });



});








  



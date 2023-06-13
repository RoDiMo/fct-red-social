import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPostsComponent } from './admin-posts.component';

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
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Post } from '../post/post';
import { PostService } from '../post.service';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { AdminService } from '../admin.service';

describe('AdminPostsComponent', () => {
  let component: AdminPostsComponent;
  let fixture: ComponentFixture<AdminPostsComponent>;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPostsComponent, CabeceraComponent, ContactosChatComponent],
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
      providers: [PostService], // Añade el servicio como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService); // Inyecta el servicio

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Comprueba que se reciven los post correctamente
  it('should fetch posts', (done) => {

    const mockData = {
      results: [
        new Post(
          'https://example.com/post1',
          '1',
          'Título del post 1',
          'Contenido del post 1',
          null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
          'Usuario1',
          10,
          20,
          5,
          new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
          true,
          'Nombre Usuario 1',
          'foto_perfil_1.jpg',
          true,
          new PerfilUsuario(
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
          ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
          false
        )
      ]
    };


    const postService = TestBed.inject(PaginaPrincipalService);
    spyOn(postService, 'getPost').and.returnValue(of(mockData));

    component.obtenerPost();

    setTimeout(() => {
      expect(component.posts).toEqual(mockData.results);
      done();
    });
  })


  // Comprueba que se reciven los usuarios correctamente
  it('should fetch users', (done) => {
    const mockData = {
      results: [
        new PerfilUsuario(
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
        )
      ]
    };

    const adminService = TestBed.inject(AdminService);
    spyOn(adminService, 'ordenarUsuarios').and.returnValue(of(mockData));

    component.fecha_inicio = '2023-05-19';
    component.fecha_fin = '';
    component.obtenerUsuarios();

    setTimeout(() => {
      expect(component.usuarios).toEqual(mockData.results);
      done();
    });
  });




  it('should order posts', (done) => {
    const campo = 'titulo';
    const mockData = {
      results: [
        new Post(
          'https://example.com/post1',
          '1',
          'Título del post 1',
          'Contenido del post 1',
          null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
          'Usuario1',
          10,
          20,
          5,
          new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
          true,
          'Nombre Usuario 1',
          'foto_perfil_1.jpg',
          true,
          new PerfilUsuario(
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
          ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
          false
        )
      ]
    };

    const adminService = TestBed.inject(AdminService);
    spyOn(adminService, 'ordenarPosts').and.returnValue(of(mockData));

    component.ordenarCampo = false;
    component.valorBusqueda = '';
    component.fecha_inicio = '2023-05-19';
    component.fecha_fin = '';

    component.ordenarPosts(campo);

    setTimeout(() => {
      expect(component.campoSeleccionado).toEqual(campo);
      expect(component.ordenarCampo).toBeTruthy();
      expect(adminService.ordenarPosts).toHaveBeenCalledWith(`-${campo}`, '', component.fecha_inicio, component.fecha_fin);
      expect(component.posts).toEqual(mockData.results);
      done();
    });
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







  describe('obtenerUsuarioRegistrado', () => {
    it('should navigate to home if user is not moderator or staff', () => {
      const usuarioRegistrado = {
        es_moderador: false,
        is_staff: false
      };

      spyOn(component._usuarioService, 'getUsuario').and.returnValue(of(usuarioRegistrado));
      spyOn(component.router, 'navigate'); // Espía el método navigate del router

      component.obtenerUsuarioRegistrado();

      expect(component.router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not navigate if user is moderator', () => {
      const usuarioRegistrado = {
        es_moderador: true,
        is_staff: false
      };

      spyOn(component._usuarioService, 'getUsuario').and.returnValue(of(usuarioRegistrado));
      spyOn(component.router, 'navigate'); // Espía el método navigate del router

      component.obtenerUsuarioRegistrado();

      expect(component.router.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate if user is staff', () => {
      const usuarioRegistrado = {
        es_moderador: false,
        is_staff: true
      };

      spyOn(component._usuarioService, 'getUsuario').and.returnValue(of(usuarioRegistrado));
      spyOn(component.router, 'navigate'); // Espía el método navigate del router

      component.obtenerUsuarioRegistrado();

      expect(component.router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('enlaceAplicacion', () => {
    it('should navigate to home', () => {
      spyOn(component.router, 'navigate'); // Espía el método navigate del router

      component.enlaceAplicacion();

      expect(component.router.navigate).toHaveBeenCalledWith(['/']);
    });
  });



  describe('guardarValorBusqueda', () => {
    it('should order posts and update posts array', () => {
      const campoSeleccionado = 'titulo';
      const valorBusqueda = 'example';
      const fecha_inicio = '2023-05-19';
      const fecha_fin = '';

      const ordenarPostsResponse = {
        results: [
          new Post(
            'https://example.com/post1',
            '1',
            'Título del post 1',
            'Contenido del post 1',
            null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
            'Usuario1',
            10,
            20,
            5,
            new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
            true,
            'Nombre Usuario 1',
            'foto_perfil_1.jpg',
            true,
            new PerfilUsuario(
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
            ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
            false
          )
        ]
      };

      spyOn(component._adminService, 'ordenarPosts').and.returnValue(of(ordenarPostsResponse));

      component.campoSeleccionado = campoSeleccionado;
      component.ordenarCampo = true;
      component.valorBusqueda = valorBusqueda;
      component.fecha_inicio = fecha_inicio;
      component.fecha_fin = fecha_fin;

      component.guardarValorBusqueda();

      expect(component._adminService.ordenarPosts).toHaveBeenCalledWith(`-${campoSeleccionado}`, valorBusqueda, fecha_inicio, fecha_fin);
      expect(component.posts).toEqual(ordenarPostsResponse.results);
    });

    it('should not modify campoSeleccionado and ordenarCampo if ordenarCampo is false', () => {
      const campoSeleccionado = 'titulo';
      const valorBusqueda = 'example';
      const fecha_inicio = '2023-05-19';
      const fecha_fin = '';

      const ordenarPostsResponse = {
        results: [
          new Post(
            'https://example.com/post1',
            '1',
            'Título del post 1',
            'Contenido del post 1',
            null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
            'Usuario1',
            10,
            20,
            5,
            new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
            true,
            'Nombre Usuario 1',
            'foto_perfil_1.jpg',
            true,
            new PerfilUsuario(
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
            ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
            false
          )
        ]
      };

      spyOn(component._adminService, 'ordenarPosts').and.returnValue(of(ordenarPostsResponse));

      component.campoSeleccionado = campoSeleccionado;
      component.ordenarCampo = false;
      component.valorBusqueda = valorBusqueda;
      component.fecha_inicio = fecha_inicio;
      component.fecha_fin = fecha_fin;

      component.guardarValorBusqueda();

      expect(component._adminService.ordenarPosts).toHaveBeenCalledWith(campoSeleccionado, valorBusqueda, fecha_inicio, fecha_fin);
      expect(component.campoSeleccionado).toEqual(campoSeleccionado);
      expect(component.ordenarCampo).toBeFalsy();
      expect(component.posts).toEqual(ordenarPostsResponse.results);
    });
  });



  describe('ocultarPost', () => {
    it('should hide post and call guardarValorBusqueda if data.status is 200', () => {
      const id = 'post-id';
      const post =new Post(
        'https://example.com/post1',
        '1',
        'Título del post 1',
        'Contenido del post 1',
        null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
        'Usuario1',
        10,
        20,
        5,
        new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
        true,
        'Nombre Usuario 1',
        'foto_perfil_1.jpg',
        true,
        new PerfilUsuario(
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
        ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
        false
      )


      const post1 =new Post(
        'https://example.com/post1',
        '1',
        'Título del post 1',
        'Contenido del post 1',
        null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
        'Usuario1',
        10,
        20,
        5,
        new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
        true,
        'Nombre Usuario 1',
        'foto_perfil_1.jpg',
        true,
        new PerfilUsuario(
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
        ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
        true
      )



      const modificarPostResponse = {
        status: 200
      };

      spyOn(component.postOcultado, 'patchValue');
      spyOn(component._actualizarPost, 'modificarPost').and.returnValue(of(modificarPostResponse));
      spyOn(component, 'guardarValorBusqueda');

      component.ocultarPost(id, post);
      component.mostrarPost(id, post1);

      expect(component.postOcultado.patchValue).toHaveBeenCalledWith({
        titulo: post.titulo,
        contenido: post.contenido,
        usuario: post.usuario,
        fecha_publicacion: post.fecha_publicacion,
        oculto: true
      });

      

      expect(component._actualizarPost.modificarPost).toHaveBeenCalledWith(id, component.postOcultado.value);

      expect(component.guardarValorBusqueda).toHaveBeenCalled();
    });

    it('should not call guardarValorBusqueda if data.status is not 200', () => {
      const id = 'post-id';
      const post = new Post(
        'https://example.com/post1',
        '1',
        'Título del post 1',
        'Contenido del post 1',
        null, // Coloca aquí la imagen de ejemplo o deja null si no es relevante para la prueba
        'Usuario1',
        10,
        20,
        5,
        new Date(), // Coloca aquí la fecha de ejemplo o utiliza new Date() si es la fecha actual
        true,
        'Nombre Usuario 1',
        'foto_perfil_1.jpg',
        true,
        new PerfilUsuario(
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
        ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
        false
      )

      const modificarPostResponse = {
        status: 500
      };

      spyOn(component.postOcultado, 'patchValue');
      spyOn(component._actualizarPost, 'modificarPost').and.returnValue(of(modificarPostResponse));
      spyOn(component, 'guardarValorBusqueda');

      component.ocultarPost(id, post);

      expect(component.postOcultado.patchValue).toHaveBeenCalledWith({
        titulo: post.titulo,
        contenido: post.contenido,
        usuario: post.usuario,
        fecha_publicacion: post.fecha_publicacion,
        oculto: true
      });


      
      expect(component._actualizarPost.modificarPost).toHaveBeenCalledWith(id, component.postOcultado.value);

      expect(component.guardarValorBusqueda).not.toHaveBeenCalled();
    });
  });


});







import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PostComponent } from './post.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PostService } from '../post.service';
import { GestionLikesService } from '../gestion-likes.service';
import { ComentariosService } from '../comentarios.service';
import { Likes } from '../home/home';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postService: PostService;
  let perfilUsuarioService: PerfilUsuarioService;
  let router: Router;
  let gestionLikesService: GestionLikesService;
  let httpMock: HttpTestingController;
  let comentariosService: ComentariosService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PostComponent,
        CabeceraComponent,
        ContactosChatComponent,
      ],
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
      providers: [PostService, PerfilUsuarioService, Router, GestionLikesService, ComentariosService],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
    router = TestBed.inject(Router);
    gestionLikesService = TestBed.inject(GestionLikesService);
    httpMock = TestBed.inject(HttpTestingController);
    comentariosService = TestBed.inject(ComentariosService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  it('should fetch post and user data on initialization', () => {
    const post = {

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

    };
    const userData = {
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

    spyOn(postService, 'obtenerPost').and.returnValue(of(post));
    spyOn(perfilUsuarioService, 'getUsuario').and.returnValue(of(userData));

    component.id = post.id;
    component.ngOnInit();


    expect(perfilUsuarioService.getUsuario).toHaveBeenCalledWith(post.usuario);
    expect(component.posts).toEqual([post]);
    expect(component.posts[0].nombre_usuario).toBe(userData.username);
    expect(component.posts[0].foto_perfil).toBe(userData.foto_perfil);
    expect(component.formularioImagenPost.value).toEqual({
      titulo: post.titulo,
      contenido: post.contenido,
      usuario: post.usuario,
      imagen: null,
    });
  });


  it('should return true if user is staff', () => {
    component.usuario = {
      is_staff: true,
    };

    const result = component.esCreadorPost({ nombre_usuario: 'user1' });

    expect(result).toBeTrue();
  });

  it('should return false if the field username is different from the user credentials', () => {
    component.usuario = {
      is_staff: false,
    };
    component.credenciales = {
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



    const result = component.esCreadorPost({ nombre_usuario: 'user2' });

    expect(result).toBeFalse();
  });

  it('should return true if no user or field username is provided', () => {
    component.usuario = undefined;
    component.credenciales = {
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

    const result = component.esCreadorPost({});

    expect(result).toBeTrue();
  });



  it('should delete the post and navigate to the homepage', () => {
    const deletePostId = {
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
    };
    spyOn(postService, 'eliminarPost').and.returnValue(of({ status: 200 }));
    spyOn(router, 'navigateByUrl');

    component.posts = [deletePostId];

    component.eliminarPost();

    expect(postService.eliminarPost).toHaveBeenCalledWith(deletePostId.id);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should navigate to the modify post page', () => {
    const postId = '1';
    spyOn(router, 'navigateByUrl');

    component.posts = [{
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
    },];

    component.modificarPost();

    expect(router.navigateByUrl).toHaveBeenCalledWith(`modifica-post/${postId}`);
  });



  it('should manage users and set like status to false', () => {
    const userId = {
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

    const postId = {
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
    };
    const userUrl = `http://localhost:8000/usuarios/${userId}/`;
    const postUrl = `http://localhost:8000/posts/${postId}/`;

    spyOn(perfilUsuarioService, 'getPerfilUsuario').and.returnValue(of({ id: userId }));


    component.credenciales = userId;

    component.gestionarUsuarios();


    expect(perfilUsuarioService.getPerfilUsuario).toHaveBeenCalledWith(userId.id);

    expect(component.usuario).toEqual({ id: userId });


  });


  it('should fetch comments for a given post ID and populate data', () => {
    const postId = '1';
    const mockCommentsResponse = {
      results: [
        {
          id: '1',
          contenido: 'Este es un comentario de ejemplo',
          post: {
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
          usuario: {
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
          fecha_creacion: new Date(),
          nombre_usuario: 'Usuario de ejemplo',
          foto_perfil: 'ruta/a/foto_perfil.jpg'
        },
        // Agrega más comentarios de ejemplo si es necesario
      ]
    };
    const mockUserResponse = {
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

    spyOn(comentariosService, 'obtenerComentariosPost').and.returnValue(of(mockCommentsResponse));
    spyOn(perfilUsuarioService, 'getUsuario').and.returnValue(of(mockUserResponse));

    component.mostrarComentarios(postId);

    expect(comentariosService.obtenerComentariosPost).toHaveBeenCalledWith(postId);

    expect(component.comentarios).toEqual(mockCommentsResponse.results);


    for (let comentario of component.comentarios) {
      expect(perfilUsuarioService.getUsuario).toHaveBeenCalledWith(comentario.usuario);
      expect(comentario.nombre_usuario).toEqual(mockUserResponse.username);
      expect(comentario.foto_perfil).toEqual(mockUserResponse.foto_perfil);
    }
  });



  it('should create a new comment and reset the form', () => {
    // Mock the response of the nuevoComentario() service method
    const comentarioResponse = { status: 201 };
    spyOn(comentariosService, 'nuevoComentario').and.returnValue(of(comentarioResponse));

    // Set values to the form fields
    component.formularioComent.setValue({
      contenido: null,
      post: null,
      usuario: null
    });

    // Trigger the nuevoComentario() method
    component.nuevoComentario();

    // Expect the service method to have been called with the form value
    expect(comentariosService.nuevoComentario).toHaveBeenCalledWith(component.formularioComent.value);

  });


  it('should navigate to "modifica-comentario/:id" route', () => {
    const id = 'comentario-id';
    spyOn(router, 'navigateByUrl');

    component.modificaComentario(id);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`modifica-comentario/${id}`);
  });


  it('should delete a comment and call ngOnInit()', () => {
    const id = 'comentario-id';
    const comentarioResponse = { status: 204 };
    spyOn(comentariosService, 'eliminarComentario').and.returnValue(of(comentarioResponse));
    spyOn(console, 'log');
    spyOn(component, 'ngOnInit');

    component.eliminarComentario(id);

    expect(comentariosService.eliminarComentario).toHaveBeenCalledWith(id);
    expect(console.log).toHaveBeenCalledWith(comentarioResponse.status);
    expect(component.ngOnInit).toHaveBeenCalled();
  });



  it('should update the number of comments for the post', () => {
    const numComentarios = 5;
    const postResponse = {
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
    };
    spyOn(postService, 'obtenerPost').and.returnValue(of(postResponse));
    spyOn(postService, 'modificarPost').and.returnValue(of(/* Respuesta exitosa */));

    component.numComentarios(numComentarios);

    expect(postService.obtenerPost).toHaveBeenCalledWith(component.id);
    expect(postService.modificarPost).toHaveBeenCalledWith(
      postResponse.id,
      {
        titulo: postResponse.titulo,
        contenido: postResponse.contenido,
        usuario: postResponse.usuario,
        fecha_publicacion: postResponse.fecha_publicacion,
        num_comentarios: numComentarios
      }
    );
  });


  it('should update number of likes and modify post', () => {
    const idPost = '1';
    const urlPost = 'post-url';

    const likesData = {
      results: [
        {
          usuario: component.usuario?.url
        },
        // Agrega más likes si es necesario para probar diferentes casos
      ]
    };

    spyOn(gestionLikesService, 'obtenerPosts').and.returnValue(of(likesData));
    spyOn(gestionLikesService, 'eliminarLike').and.returnValue(of({}));
    spyOn(gestionLikesService, 'guardarLike').and.returnValue(of({}));
    spyOn(postService, 'obtenerPostUrl').and.returnValue(of({
      id: '1',
      titulo: 'Post 1',
      contenido: 'Contenido del post 1',
      usuario: 'Usuario 1',
      fecha_publicacion: new Date(),
      num_likes: 0
    }));
    spyOn(postService, 'modificarPost').and.returnValue(of({ status: 200 }));

    component.gestionLikes(idPost, urlPost);

    expect(gestionLikesService.obtenerPosts).toHaveBeenCalledWith(idPost);

    // Agrega expectativas adicionales según sea necesario
  });


  it('should update number of likes and modify post', () => {
    const idPost = '1';
    const urlPost = 'post-url';

    const likes: Likes[] = [
      { usuario: 'http://localhost:8000/usuarios/1/', post: 'http://localhost:8000/posts/1/' },
    ];

    spyOn(gestionLikesService, 'obtenerPosts').and.returnValue(of({ results: likes }));
    spyOn(gestionLikesService, 'eliminarLike').and.returnValue(of({}));
    spyOn(gestionLikesService, 'guardarLike').and.returnValue(of({}));

    const likeUsuario = likes.find(post => post.usuario === component.usuario?.url);
    let num_likes = 0;

    if (likeUsuario) {
      // Controlamos el numero de likes
      num_likes = likes.length - 1;
      spyOn(gestionLikesService, 'eliminarLike').and.returnValue(of({}));
    } else {
      // Controlamos el numero de likes
      num_likes = likes.length + 1;
      const newLike: Likes = new Likes(component.usuario?.url, urlPost);

    }

    component.gestionLikes(idPost, urlPost);

    expect(gestionLikesService.obtenerPosts).toHaveBeenCalledWith(idPost);
    expect(gestionLikesService.eliminarLike).toHaveBeenCalledTimes(likeUsuario ? 1 : 0);
    expect(gestionLikesService.guardarLike).toHaveBeenCalledTimes(likeUsuario ? 0 : 1);
  });

  it('should call actualizarNumVisitas if post is not updated', () => {
    const id = '1';
    const postAlmacenado = null as any

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(component, 'actualizarNumVisitas');

    component.agregarVisitas(id);

    expect(localStorage.getItem).toHaveBeenCalledWith(`post-null-visit-updated`);

  });


  it('should not call actualizarNumVisitas if post is already updated', () => {
    const id = 'example-id';
    const postAlmacenado = 'true';

    spyOn(localStorage, 'getItem').and.returnValue(postAlmacenado);
    spyOn(component, 'actualizarNumVisitas');

    component.agregarVisitas(id);

    expect(component.actualizarNumVisitas).not.toHaveBeenCalled();
  });

  it('should update post data and set local storage flag', fakeAsync(() => {
    // Arrange
    const id = '1';
    const post = {
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
    }


    spyOn(localStorage, 'setItem');

    // Act
    component.actualizarNumVisitas(id);
    tick();

    // Assert
    expect(localStorage.setItem).toHaveBeenCalledWith(`post-${id}-visit-updated`, 'true');
  }));


  it('should update character counts when content is within limit', () => {
    // Arrange
    const contenido = 'Contenido del post';

    // Act
    component.controlarCaracteres(contenido);

    // Assert
    expect(component.caracRestantes).toEqual(1024 - contenido.length);
    expect(component.quedanCaracteres).toBeTrue();

  });


  it('should update character counts when content exceeds limit', () => {
    // Arrange
    const contenido = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nisi justo, sodales vitae ante id, posuere interdum arcu. Praesent tempor velit vel interdum molestie. Proin vel tortor pharetra dui hendrerit ultrices a finibus magna. In at malesuada dolor. Vivamus gravida gravida magna, et viverra neque pellentesque vel. Nulla volutpat maximus rhoncus. In venenatis, ante sed viverra lobortis, ex lorem semper quam, ut tempus ipsum dui id nisl. In posuere lacus leo, ullamcorper vulputate orci porta vel. Nulla posuere in nibh a ultrices. Curabitur sed nunc sit amet augue vestibulum faucibus. Praesent id rutrum justo, vel fermentum leo. Nunc nunc risus, mollis a neque at, rutrum viverra risus. Mauris a facilisis risus. Pellentesque pretium tincidunt dui, at volutpat turpis. Nam bibendum libero ut diam tempus, in commodo sem fermentum. Curabitur in leo vel lorem tristique fermentum.Praesent eu semper lorem, at dapibus libero. Aenean aliquam luctus pharetra. Cras magna purus, dapibus sit doloraqwertyuiopñlkjhgfdsa<zx.';
    
    // Act
    component.controlarCaracteres(contenido);

    // Assert
    expect(component.caracRestantes).toEqual(0);
    expect(component.quedanCaracteres).toBeFalse();

  });


  it('should update post data on obtenerPost success', () => {
    const postId = '123';
    const fecha = new Date('2023-06-01')
    const postData = {
      url: '',
      id: '1',
      titulo: 'Post 1',
      contenido: 'Contenido del post 1',
      imagen: '',
      usuario: 'Usuario 1',
      num_likes: 10,
      num_visitas: 50,
      num_comentarios: 5,
      fecha_publicacion: fecha,
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
        fecha_alta: fecha
      }, // Aquí debes asignar el objeto de tipo PerfilUsuario correspondiente
      oculto: false
    }

    spyOn(postService, 'obtenerPost').and.returnValue(of(postData));

    component.actualizarNumVisitas(postId);

    expect(component.posts).toEqual([postData]);
    expect(component.formularioVisitas.value).toEqual({
      titulo: 'Post 1',
      contenido: 'Contenido del post 1',
      usuario: 'Usuario 1',
      fecha_publicacion: fecha,
      num_visitas: 51,
    });


  });

  it('should call obtenerPost and gestionarUsuarios on modificarPost success', () => {
    const postId = '123';
    const postData = {
      id: postId,
      titulo: 'Test Post',
      contenido: 'Lorem ipsum dolor sit amet',
      usuario: 'John Doe',
      fecha_publicacion: '2023-06-14',
      num_visitas: 10,
    };

    spyOn(postService, 'obtenerPost').and.returnValue(of(postData));
    spyOn(postService, 'modificarPost').and.returnValue(of({ status: 200 }));
    spyOn(component, 'obtenerPost');
    spyOn(component, 'gestionarUsuarios');

    component.actualizarNumVisitas(postId);

    expect(postService.obtenerPost).toHaveBeenCalledWith(postId);
    expect(postService.modificarPost).toHaveBeenCalledWith(postId, {
      titulo: 'Test Post',
      contenido: 'Lorem ipsum dolor sit amet',
      usuario: 'John Doe',
      fecha_publicacion: '2023-06-14',
      num_visitas: 11,
    });
    expect(component.obtenerPost).toHaveBeenCalled();
    expect(component.gestionarUsuarios).toHaveBeenCalled();
  });


});











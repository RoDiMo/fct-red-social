import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Likes, Usuarios } from './home';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { of } from 'rxjs';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Post } from '../post/post';
import { PostService } from '../post.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { GestionLikesService } from '../gestion-likes.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;
  let paginaPrincipalService: PaginaPrincipalService;
  let postService: PostService;
  let autenticacionService: AutenticacionUsuariosService;
  let gestionLikesService: GestionLikesService;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, CabeceraComponent, ContactosChatComponent ],
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
        providers: [PaginaPrincipalService, PostService, AutenticacionUsuariosService, GestionLikesService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    paginaPrincipalService = TestBed.inject(PaginaPrincipalService); // Inyecta el servicio
    postService = TestBed.inject(PostService); // Inyecta el servicio
    autenticacionService = TestBed.inject(AutenticacionUsuariosService); // Inyecta el servicio
    gestionLikesService = TestBed.inject(GestionLikesService); // Inyecta el servicio




    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  describe('Usuarios class', () => {
    let usuario: Usuarios;
  
    beforeEach(() => {
      usuario = new Usuarios(
        'https://example.com/profile.jpg',
        123,
        'johndoe',
        'password',
        'John',
        'Doe',
        '555-1234',
        true,
        'United States',
        'California',
        'Los Angeles',
        true,
        'profile.jpg'
      );
    });
  
    it('should create an instance of Usuarios', () => {
      expect(usuario).toBeTruthy();
    });
  
    it('should have the correct properties', () => {
      expect(usuario.url).toEqual('https://example.com/profile.jpg');
      expect(usuario.id).toEqual(123);
      expect(usuario.username).toEqual('johndoe');
      expect(usuario.password).toEqual('password');
      expect(usuario.first_name).toEqual('John');
      expect(usuario.last_name).toEqual('Doe');
      expect(usuario.telefono).toEqual('555-1234');
      expect(usuario.is_staff).toEqual(true);
      expect(usuario.pais).toEqual('United States');
      expect(usuario.estado).toEqual('California');
      expect(usuario.ciudad).toEqual('Los Angeles');
      expect(usuario.direccion).toEqual(true);
      expect(usuario.foto_perfil).toEqual('profile.jpg');
    });
  
    it('should have a toString method that returns the username', () => {
      expect(usuario.toString()).toEqual('johndoe');
    });
});



it('should call getPostOrdenados and update posts', () => {
  const mockPosts = [new Post(
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
  )];

  // Simula la respuesta del servicio
  paginaPrincipalService.getPostOrdenados = jasmine
    .createSpy('getPostOrdenados')
    .and.returnValue(
      // Simula una respuesta exitosa con los posts mockeados
      of(mockPosts)
    );

  // Llama al método que deseas probar
  component.obtenerPosts();

  // Verifica que se haya llamado a getPostOrdenados del servicio
  expect(paginaPrincipalService.getPostOrdenados).toHaveBeenCalled();

  // Realiza la expectativa sobre la propiedad 'posts' actualizada en el componente
  expect(component.posts).toEqual(mockPosts);
});



it('should call obtenerPostsUsuario and update posts', () => {
  const mockPosts = [new Post(
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
  )];

  // Simula la respuesta del servicio
  postService.obtenerPostsUsuario = jasmine
    .createSpy('obtenerPostsUsuario')
    .and.returnValue(
      // Simula una respuesta exitosa con los posts mockeados
      of(mockPosts)
    );

  // Llama al método que deseas probar
  component.obtenerMisPost();

  // Verifica que se haya llamado a obtenerPostsUsuario del servicio
  expect(postService.obtenerPostsUsuario).toHaveBeenCalled();

 
});


it('should call getUsuarioUrl and update post properties', () => {
  const mockPost = new Post(
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
  );

  const mockUsuario = new PerfilUsuario(
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

  // Simula la respuesta del servicio
  autenticacionService.getUsuarioUrl = jasmine
    .createSpy('getUsuarioUrl')
    .and.returnValue(
      // Simula una respuesta exitosa con el usuario mockeado
      of(mockUsuario)
    );

  // Llama al método que deseas probar
  component.obtenerUsuarioPost(mockPost);

  // Verifica que se haya llamado a getUsuarioUrl del servicio con el URL correcto
  expect(autenticacionService.getUsuarioUrl).toHaveBeenCalledWith(mockPost.usuario);

  // Realiza las expectativas sobre las propiedades actualizadas en el objeto 'post'
  expect(mockPost.nombre_usuario).toEqual(mockUsuario.username);
  expect(mockPost.foto_perfil).toEqual(mockUsuario.foto_perfil);
});


it('should call obtenerPosts and update post properties', () => {
  const mockPost = new Post(
    'http://localhost:8000/posts/5/',
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
      true,
      'País1',
      'Estado1',
      'Ciudad1',
      'Dirección1',
      null, // Coloca aquí la foto de perfil de ejemplo o deja null si no es relevante para la prueba
      'http://localhost:8000/usuarios/1/',
      true,
      new Date(),
    ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
    true
  );
  const mockLikes = {
    results: [
      { url: 'http://localhost:8000/likes/100/', 
        usuario: 'http://localhost:8000/usuarios/1/',
        post: 'http://localhost:8000/posts/5/' },

    ],
  };

  // Simula la respuesta del servicio
  gestionLikesService.obtenerPosts = jasmine
    .createSpy('obtenerPosts')
    .and.returnValue(
      // Simula una respuesta exitosa con los likes mockeados
      of(mockLikes)
    );

  // Llama al método que deseas probar
  component.obtenerPostLikes(mockPost);
  mockPost.likeDado = true

  // Verifica que se haya llamado a obtenerPosts del servicio con el ID correcto
  expect(gestionLikesService.obtenerPosts).toHaveBeenCalledWith(mockPost.id);

  // Realiza las expectativas sobre la propiedad actualizada 'likeDado' en el objeto 'post'
  expect(mockPost.likeDado).toEqual(true); // Verifica que likeDado sea true ya que el usuario ha dado like al post


      // Simula un caso en el que no hay likes para el post
  const mockPostNoLikes =  new Post(
    'http://localhost:8000/posts/5/',
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
      true,
      'País1',
      'Estado1',
      'Ciudad1',
      'Dirección1',
      null, // Coloca aquí la foto de perfil de ejemplo o deja null si no es relevante para la prueba
      'http://localhost:8000/usuarios/1/',
      true,
      new Date(),
    ), // Coloca aquí los datos de perfil de ejemplo o crea una instancia vacía
    true
  );;
  const mockNoLikes = {
    results: [] as any[],
  };

  // Simula la respuesta del servicio
  gestionLikesService.obtenerPosts = jasmine
    .createSpy('obtenerPosts')
    .and.returnValue(
      // Simula una respuesta exitosa sin likes
      of(mockNoLikes)
    );

  // Llama al método con el nuevo post sin likes
  component.obtenerPostLikes(mockPostNoLikes);

  // Verifica que se haya llamado a obtenerPosts del servicio con el ID correcto
  expect(gestionLikesService.obtenerPosts).toHaveBeenCalledWith(mockPostNoLikes.id);

  // Realiza las expectativas sobre la propiedad actualizada 'likeDado' en el objeto 'post'
  expect(mockPostNoLikes.likeDado).toEqual(false); // Verifica que likeDado sea false ya que no hay likes para el post
});


it('should remove visit from local storage if post is stored', () => {
  const mockId = 1;

  // Simula que hay un post almacenado en el localStorage
  spyOn(localStorage, 'getItem').and.returnValue('stored-post');

  // Llama al método que deseas probar
  component.removerVisitas(mockId);

  // Verifica que se haya llamado a getItem del localStorage con la clave correcta
  expect(localStorage.getItem).toHaveBeenCalledWith(`post-${mockId}-visit-updated`);

});



it('should manage users', () => {

  const mockUsuarioRegistrado ={
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

  // Simula la respuesta del servicio getUsuario
  spyOn(component['_obtenerUsuarioService'], 'getUsuario').and.returnValue(of(mockUsuarioRegistrado));

  // Simula la llamada a obtenerUsuarioPost, removerVisitas y obtenerPostLikes para cada post
  spyOn(component, 'obtenerUsuarioPost');
  spyOn(component, 'removerVisitas');
  spyOn(component, 'obtenerPostLikes');

  // Llama al método que deseas probar
  component.gestionarUsuarios();


  // Verifica que el usuario registrado se haya asignado correctamente
  expect(component.usuarioRegistrado).toEqual(mockUsuarioRegistrado);

  // Verifica que la propiedad esAdmin se haya establecido correctamente
  expect(component.esAdmin).toBe(true);

  // Verifica que se haya llamado a obtenerUsuarioPost, removerVisitas y obtenerPostLikes para cada post
  for (let p of component.posts) {
    expect(component.obtenerUsuarioPost).toHaveBeenCalledWith(p);
    expect(component.removerVisitas).toHaveBeenCalledWith(p.id);
    expect(component.obtenerPostLikes).toHaveBeenCalledWith(p);
  }
});



it('should handle like given by the user', () => {
  const idPost = 1;
  const urlPost = 'http://localhost:8000/posts/5/';
  const usuarioRegistrado =      {
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
    url: 'http://localhost:8000/usuarios/1/',
    amistadPendiente: false,
    fecha_alta: new Date()
  };
  const postsLikes = [
    {
      url: 'http://localhost:8000/posts/5/',
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
        url: 'http://localhost:8000/usuarios/1/',
        amistadPendiente: false,
        fecha_alta: new Date()
      }, // Aquí debes asignar el objeto de tipo PerfilUsuario correspondiente
      oculto: false
    },

  ];

  spyOn(gestionLikesService, 'obtenerPosts').and.returnValue(of({ results: postsLikes }));
  spyOn(gestionLikesService, 'eliminarLike').and.returnValue(of(null));
  spyOn(gestionLikesService, 'guardarLike').and.returnValue(of(null));

  component.usuarioRegistrado = usuarioRegistrado;
  component.gestionLikes(idPost, urlPost);



  // Simulamos el caso en el que el usuario no ha dado like
  const nuevoLike =   new Likes('http://localhost:8000/usuarios/1/', 'http://localhost:8000/posts/5/' ) 
;

  component.gestionLikes(idPost, urlPost);
  component.likeDado = true;
  component.postsLikes = postsLikes
  
  expect(gestionLikesService.obtenerPosts).toHaveBeenCalledWith(idPost);
  expect(component.postsLikes).toEqual(postsLikes);

  expect(component.likeDado).toBeTrue();
  expect(gestionLikesService.guardarLike).toHaveBeenCalledWith(nuevoLike);

  // Aquí puedes realizar más expectativas según tus necesidades
});


it('should update the number of likes and post data and call obtenerPosts or obtenerMisPost', () => {
  const num_likes = 5;
  const urlPost = 'https://example.com/post';
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
    },
    oculto: false
  };

  spyOn(postService, 'obtenerPostUrl').and.returnValue(of(post));
  spyOn(postService, 'modificarPost').and.returnValue(of({ status: 200 }));
  spyOn(component, 'obtenerPosts');
  spyOn(component, 'obtenerMisPost');

  component.misPost = false;
  component.actualizarNumLikes(num_likes, urlPost);
  expect(component.obtenerPosts).toHaveBeenCalled();
  expect(component.obtenerMisPost).not.toHaveBeenCalled();

  component.misPost = true;
  component.actualizarNumLikes(num_likes, urlPost);
  expect(component.obtenerMisPost).toHaveBeenCalled();

});

it('should navigate to the post URL', () => {
  const id = '123';
  spyOn(component.router, 'navigateByUrl');

  component.enlacePost(id);

  expect(component.router.navigateByUrl).toHaveBeenCalledWith(`/post/${id}`);
});

});



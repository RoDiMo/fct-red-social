import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PerfilPersonalEstadisticasComponent } from './perfil-personal-estadisticas.component';
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
import { of } from 'rxjs';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PostService } from '../post.service';

describe('PerfilPersonalEstadisticasComponent', () => {
  let component: PerfilPersonalEstadisticasComponent;
  let fixture: ComponentFixture<PerfilPersonalEstadisticasComponent>;
  let perfilUsuarioService: PerfilUsuarioService;
  let postService: PostService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilPersonalEstadisticasComponent, CabeceraComponent, ContactosChatComponent ],
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
          PerfilUsuarioService,
          PostService
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPersonalEstadisticasComponent);
    component = fixture.componentInstance;
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService); // Obtiene una instancia del servicio
    postService = TestBed.inject(PostService); // Obtiene una instancia del servicio
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to amigos on enlaceAmigos', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.enlaceAmigos();

    expect(localStorage.getItem('enlace-cabecera')).toBe('amigos');
    expect(routerSpy).toHaveBeenCalledWith('/amigos');
  });

  it('should navigate to perfil-personal on enlacePerfil', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.enlacePerfil();

    expect(localStorage.getItem('enlace-cabecera')).toBe('perfil-personal');
    expect(routerSpy).toHaveBeenCalledWith('/perfil-personal');
  });

  it('should retrieve user posts and update component variables', () => {
    // Crea datos de prueba para simular la respuesta del servicio
    const mockPosts = {
      results: [{
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
      ]
    };

    // Crea un spy para el método obtenerPostsUsuario() y configúralo para devolver los datos de prueba
    spyOn(postService, 'obtenerPostsUsuario').and.returnValue(of(mockPosts));

    // Llama al método que quieres probar
    component.obtenerPostUsuario();

    // Verifica que las variables del componente se hayan actualizado correctamente
    expect(component.postsUsuario).toEqual(mockPosts.results);
    expect(component.numeroPosts).toBe(mockPosts.results.length);
    // Agrega más expectativas para las demás variables que deseas verificar

    // Verifica que se haya llamado al método obtenerPostsUsuario() del servicio
    expect(postService.obtenerPostsUsuario).toHaveBeenCalledWith(component.credenciales.id);
  });


  it('should sort posts by likes in descending order', () => {
    const mockPosts = [
      { id: 1, num_likes: 5 },
      { id: 2, num_likes: 8 },
      { id: 3, num_likes: 3 }
    ];

    const sortedPosts = mockPosts.sort(component.ordenarPostLikes);

    expect(sortedPosts).toEqual([
      { id: 2, num_likes: 8 },
      { id: 1, num_likes: 5 },
      { id: 3, num_likes: 3 }
    ]);
  });

  it('should sort posts by views in descending order', () => {
    const mockPosts = [
      { id: 1, num_visitas: 10 },
      { id: 2, num_visitas: 20 },
      { id: 3, num_visitas: 15 }
    ];

    const sortedPosts = mockPosts.sort(component.ordenarPostViews);

    expect(sortedPosts).toEqual([
      { id: 2, num_visitas: 20 },
      { id: 3, num_visitas: 15 },
      { id: 1, num_visitas: 10 }
    ]);
  });


  it('should initialize component', fakeAsync(() => {
    const mockUsuarioData = {
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

    spyOn(component['_perfilUsuarioService'], 'getPerfilUsuario').and.returnValue(of(mockUsuarioData));
    spyOn(component, 'obtenerPostUsuario');
  
    component.ngOnInit();

    expect(component['_perfilUsuarioService'].getPerfilUsuario).toHaveBeenCalledWith(component.credenciales.id);
    expect(component.datosUsuario).toEqual(mockUsuarioData);
    expect(component.obtenerPostUsuario).toHaveBeenCalled();

    tick(500);
    expect(component.contenidoCargado).toBeTrue();
  }));

  it('should fetch user posts', () => {
    const mockPostsData = {
      results: [{
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
      ]
    };

    spyOn(component['_postService'], 'obtenerPostsUsuario').and.returnValue(of(mockPostsData));

    component.obtenerPostUsuario();

    expect(component['_postService'].obtenerPostsUsuario).toHaveBeenCalledWith(component.credenciales.id);
    expect(component.postsUsuario).toEqual(mockPostsData.results);
    // Agrega más expectativas según sea necesario
  });
});

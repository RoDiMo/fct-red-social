import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CrearPostComponent } from './crear-post.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { of, throwError } from 'rxjs';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { PostService } from '../post.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { DetallePostModalComponent } from '../detalle-post-modal/detalle-post-modal.component';


describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let postService: PostService;


  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['obtenerPost']);
 

    await TestBed.configureTestingModule({
      declarations: [ CrearPostComponent,
        CabeceraComponent,
        ContactosChatComponent, ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPostComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    postService = TestBed.inject(PostService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should create in edition mode', () => {
    const postId = '123';
    const mockPost = { id: postId, titulo: 'Test', contenido: 'Lorem ipsum', usuario: 'JohnDoe' };
    postServiceSpy.obtenerPost.and.returnValue(of(mockPost));
    TestBed.inject(ActivatedRoute).snapshot.paramMap.get = (param: string) => postId; // Simulate ID being provided

    fixture.detectChanges();
    component.modoEdicion = true

    expect(component).toBeTruthy();
    expect(component.modoEdicion).toBeTrue();
  
  });
 




  it('should call controlarCaracteres when formularioPost value changes', () => {
    const mockPost = { id: '123', titulo: 'Test', contenido: 'Lorem ipsum', usuario: 'JohnDoe', imagen: 'example.jpg' };
    postServiceSpy.obtenerPost.and.returnValue(of(mockPost));
    TestBed.inject(ActivatedRoute).snapshot.paramMap.get = (param: string) => mockPost.id; // Simulate ID being provided
  
    fixture.detectChanges();
  
    const controlarCaracteresSpy = spyOn(component, 'controlarCaracteres');
  
    const nuevoContenido = 'New content';
    component.formularioPost.setValue({ titulo: mockPost.titulo, contenido: nuevoContenido, usuario: mockPost.usuario, imagen: mockPost.imagen });
  
    expect(controlarCaracteresSpy).toHaveBeenCalledWith(nuevoContenido);
  });


  it('should add selected file to formData when onFileSelected is called', () => {
    // Arrange
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const event = {
      target: {
        files: [file],
      },
    };
  
    // Act
    component.onFileSelected(event);
  
    // Assert
    expect(component.formData.get('imagen')).toEqual(file);
  });

  it('should set formData and pass datosPost to DetallePostModalComponent', () => {
    // Arrange
    const mockModalRef: any = {
      componentInstance: {
        datosPost: null
      }
    };
    spyOn(component.modal, 'open').and.returnValue(mockModalRef);
    const tituloValue = 'Test Title';
    const contenidoValue = 'Lorem ipsum dolor sit amet';
    const usuarioValue = 'http://localhost:8000/usuarios/1/';
    component.formularioPost.setValue({
      titulo: tituloValue,
      contenido: contenidoValue,
      usuario: usuarioValue,
      imagen: null
    });
  
    // Act
    component.detallePostModal();
  
    // Assert
    expect(component.formData.get('titulo')).toEqual(tituloValue);
    expect(component.formData.get('contenido')).toEqual(contenidoValue);
    expect(component.formData.get('usuario')).toEqual(usuarioValue);
    expect(mockModalRef.componentInstance.datosPost).toEqual(component.formularioPost.value);
    expect(component.modal.open).toHaveBeenCalledWith(DetallePostModalComponent);
  });
  
   

  it('should update caracRestantes when there are remaining characters', () => {
    const contenido = 'Hello World';

    // Llama al método que se va a probar
    component.controlarCaracteres(contenido);

    // Asegúrate de que caracRestantes se haya actualizado correctamente
    expect(component.caracRestantes).toEqual(1024 - contenido.length);

    // Asegúrate de que quedanCaracteres se haya establecido en verdadero
    expect(component.quedanCaracteres).toBeTrue();

  });


  it('should update caracRestantes when there are no remaining characters', () => {
    const contenido = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nisi justo, sodales vitae ante id, posuere interdum arcu. Praesent tempor velit vel interdum molestie. Proin vel tortor pharetra dui hendrerit ultrices a finibus magna. In at malesuada dolor. Vivamus gravida gravida magna, et viverra neque pellentesque vel. Nulla volutpat maximus rhoncus. In venenatis, ante sed viverra lobortis, ex lorem semper quam, ut tempus ipsum dui id nisl. In posuere lacus leo, ullamcorper vulputate orci porta vel. Nulla posuere in nibh a ultrices. Curabitur sed nunc sit amet augue vestibulum faucibus. Praesent id rutrum justo, vel fermentum leo. Nunc nunc risus, mollis a neque at, rutrum viverra risus. Mauris a facilisis risus. Pellentesque pretium tincidunt dui, at volutpat turpis. Nam bibendum libero ut diam tempus, in commodo sem fermentum. Curabitur in leo vel lorem tristique fermentum.Praesent eu semper lorem, at dapibus libero. Aenean aliquam luctus pharetra. Cras magna purus, dapibus sit dolor.123456789012345678901222';

    // Llama al método que se va a probar
    component.controlarCaracteres(contenido);

    // Asegúrate de que caracRestantes se haya establecido en 0
    expect(component.caracRestantes).toEqual(0);

    // Asegúrate de que quedanCaracteres se haya establecido en falso
    expect(component.quedanCaracteres).toBeFalse();

    // Asegúrate de que caracSobrantes se haya calculado correctamente
    expect(component.caracSobrantes).toEqual(-(1024 - contenido.length));
  });

  
  it('should send post', fakeAsync(() => {
    const formData = new FormData();
    formData.append('titulo', 'Test title');
    formData.append('contenido', 'Test content');
    formData.append('usuario', 'testuser');

    const nuevoPostSpy = spyOn(postService, 'nuevoPost').and.returnValue(
      of({ status: 201 })
    );

    component.formularioPost.setValue({
      titulo: 'Test title',
      contenido: 'Test content',
      usuario: 'testuser',
      imagen: null
    });

    component.enviaPost();

    tick();

    expect(nuevoPostSpy).toHaveBeenCalledWith(formData);
  }));

 

});

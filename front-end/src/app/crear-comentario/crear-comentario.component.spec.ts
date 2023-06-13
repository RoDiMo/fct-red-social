import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrearComentarioComponent } from './crear-comentario.component';
import { ComentariosService } from '../comentarios.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';

import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { of, throwError } from 'rxjs';

describe('CrearComentarioComponent', () => {
  let component: CrearComentarioComponent;
  let fixture: ComponentFixture<CrearComentarioComponent>;
  let comentarioService: ComentariosService; // Declara una variable para el servicio de comentarios
  let router: Router; // Declara una variable para el enrutador



  beforeEach(async () => {

    
    await TestBed.configureTestingModule({
      declarations: [CrearComentarioComponent, CabeceraComponent, ContactosChatComponent],
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
        providers: [ComentariosService],
      

    }).compileComponents();
    fixture = TestBed.createComponent(CrearComentarioComponent);
    component = fixture.componentInstance;
    comentarioService = TestBed.inject(ComentariosService); // Inyecta el servicio de comentarios
    router = TestBed.inject(Router); // Inyecta el enrutador

    component.ngOnInit();
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values and control characters', () => {
    // Crea un objeto de comentario mock
    const comentarioMock = {
      contenido: 'Contenido de prueba',
      post: 'ID del post',
      usuario: 'ID del usuario',
    };

    // Crea un Observable mock utilizando el operador 'of'
    const comentarioObservable = of(comentarioMock);

    // Espía el método obtenerComentario del servicio y devuelve el Observable mock
    spyOn(comentarioService, 'obtenerComentario').and.returnValue(comentarioObservable);

    // Llama al método que se va a probar
    component.obtenerValoresComentarios('ID del comentario');

    // Verifica que el método obtenerComentario se haya llamado con el ID del comentario
    expect(comentarioService.obtenerComentario).toHaveBeenCalledWith('ID del comentario');

    // Verifica que los valores del comentario se hayan asignado correctamente al formulario
    expect(component.formularioComent.value).toEqual({
      contenido: comentarioMock.contenido,
      post: comentarioMock.post,
      usuario: comentarioMock.usuario,
    });

    // Realiza las demás verificaciones necesarias en función de la lógica del método obtenerValoresComentarios
    // ...
  });


  it('should edit comentario', () => {
    // Crea un objeto de prueba para simular la respuesta del método `get`
    const mockResponse = { id: '4' };
  
    // Espía el método `get` y devuelve un observable con el objeto de prueba
    spyOn(component.http, 'get').and.returnValue(of(mockResponse));
  
    // Establece un valor válido para `this.comentario.post`
    component.comentario.post = 'http://localhost:8000/posts/4/';
  
    // Llama al método que se va a probar
    component.editarComentario();
  
    // Asegúrate de que se haya llamado al método `get` con el valor esperado
    expect(component.http.get).toHaveBeenCalledWith('http://localhost:8000/posts/4/');
  
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


 

});

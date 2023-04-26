import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUsuarioComponent } from './registro-usuario.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { of, throwError } from 'rxjs';

describe('RegistroUsuarioComponent', () => {
  let component: RegistroUsuarioComponent;
  let fixture: ComponentFixture<RegistroUsuarioComponent>;
  let servicio: AutenticacionUsuariosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [ RegistroUsuarioComponent ],
      providers: [ AutenticacionUsuariosService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroUsuarioComponent);
    component = fixture.componentInstance;
    servicio = TestBed.inject(AutenticacionUsuariosService);
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe enviar una solicitud de registro al servidor cuando se envía el formulario', () => {
    spyOn(servicio, 'nuevoUsuario').and.callThrough();
    component.formulario.setValue({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '1234567890',
      pais: 'US',
      estado: 'NY',
      ciudad: 'New York',
      direccion: '123 Main St',
      foto_perfil: null
    });
    component.nuevoUsuario();
    expect(servicio.nuevoUsuario).toHaveBeenCalled();
  });

  it('Debe mostrar un mensaje de error si el formulario es inválido', () => {
    component.formulario.setValue({
      username: null,
      email: null,
      password: null,
      first_name: null,
      last_name: null,
      telefono: null,
      pais: null,
      estado: null,
      ciudad: null,
      direccion: null,
      foto_perfil: null
    });
    component.nuevoUsuario();
    expect(component.mensajeInfo).toEqual('Formulario no válido');
  });

  it('should create a new user', () => {
    spyOn(component._registroUsuario, 'nuevoUsuario').and.callFake(() => {
      return of({});
    });

    component.formulario.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      first_name: 'Test',
      last_name: 'User',
      telefono: '555-555-5555',
      pais: 'USA',
      estado: 'CA',
      ciudad: 'Los Angeles',
      direccion: '123 Main St',
      foto_perfil: null,
    });

    component.nuevoUsuario();

    expect(component._registroUsuario.nuevoUsuario).toHaveBeenCalled();
    expect(component._registroUsuario.nuevoUsuario).toHaveBeenCalledWith(jasmine.any(FormData));
  });


  it('should set general errors if there is an error message', () => {
    const errorMessage = 'There was an error creating the user.';
    spyOn(component._registroUsuario, 'nuevoUsuario').and.returnValue(throwError({ error: { message: errorMessage } }));

    component.formulario.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      first_name: 'Test',
      last_name: 'User',
      telefono: '555-555-5555',
      pais: 'USA',
      estado: 'CA',
      ciudad: 'Los Angeles',
      direccion: '123 Main St',
      foto_perfil: null,
    });

    component.nuevoUsuario();

    expect(component._registroUsuario.nuevoUsuario).toHaveBeenCalled();
  
  });


  it('should set serverError if there is a validation error', () => {
    // Create a mock error response
    const errorResponse = {
    error: {
    username: ["Este nombre de usuario ya está en uso."],
    email: ["Este correo electrónico ya está en uso."]
    }
    };
    
    // Spy on the nuevoUsuario function and return the mock error response
    spyOn(component._registroUsuario, 'nuevoUsuario').and.returnValue(throwError(new HttpErrorResponse({ error: errorResponse })));
    
    // Set form values to valid values
    component.formulario.setValue({
    username: "marina",
    email: "test@test.com",
    password: "password123",
    first_name: "Test",
    last_name: "User",
    telefono: "123456789",
    pais: "Testland",
    estado: "Teststate",
    ciudad: "Testcity",
    direccion: "Testaddress",
    foto_perfil: null
    });
    
    // Call the nuevoUsuario function
    component.nuevoUsuario();
    

    });
  
    it('should set errors if there is a non-validation error', () => {
      // Create a mock error response
      const errorResponse = {
      error: {
      message: "Unexpected server error."
      }
      };
      
      // Spy on the nuevoUsuario function and return the mock error response
      spyOn(component._registroUsuario, 'nuevoUsuario').and.returnValue(throwError(new HttpErrorResponse({ error: errorResponse })));
      
      // Set form values to valid values
      component.formulario.setValue({
      username: "testuser",
      email: "test@test.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
      telefono: "123456789",
      pais: "Testland",
      estado: "Teststate",
      ciudad: "Testcity",
      direccion: "Testaddress",
      foto_perfil: null
      });
      
      // Call the nuevoUsuario function
      component.nuevoUsuario();
      
      });

});



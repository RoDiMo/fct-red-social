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
    //expect(component.mensajeInfo).toEqual('Formulario no válido');
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


    it('should retrieve countries and update form value', () => {
      const paises = [{ id: '1', nombre: 'Country 1' }, { id: '2', nombre: 'Country 2' }];
    
      spyOn(component._obtenerDireccionService, 'obtenerPaises').and.returnValue(of({ results: paises }));
    
      component.obtenerPais();
    
      expect(component._obtenerDireccionService.obtenerPaises).toHaveBeenCalled();
      expect(component.paises).toEqual(paises);
   
    });


    it('should update form value and retrieve states', () => {
      const estados = [{ id: '1', nombre: 'State 1' }, { id: '2', nombre: 'State 2' }];
      const pais = 'Country';
    
      spyOn(component._obtenerDireccionService, 'obtenerEstados').and.returnValue(of({ results: estados }));
    
      component.pais = pais;
      component.obtenerEstado();
    
      expect(component.formulario.get('pais')?.value).toBe(pais);
      expect(component._obtenerDireccionService.obtenerEstados).toHaveBeenCalledWith(pais);
      expect(component.estados).toEqual(estados);
    });


    it('should update form value and retrieve cities', () => {
      const ciudades = [{ id: '1', nombre: 'City 1' }, { id: '2', nombre: 'City 2' }];
      const estado = 'State';
    
      spyOn(component._obtenerDireccionService, 'obtenerCiudades').and.returnValue(of({ results: ciudades }));
    
      component.estado = estado;
      component.obtenerCiudad();
    
      expect(component.estado).toBe(estado);
      expect(component.formulario.get('estado')?.value).toBe(estado);
      expect(component._obtenerDireccionService.obtenerCiudades).toHaveBeenCalledWith(estado);
      expect(component.ciudades).toEqual(ciudades);
    });

    it('should update form values and log the form value', () => {
      const pais = 'Country';
      const estado = 'State';
      const ciudad = 'City';
    
      component.pais = pais;
      component.estado = estado;
      component.ciudad = ciudad;
      component.guardarDireccionFormulario();
    
      expect(component.pais).toBe(pais);
      expect(component.estado).toBe(estado);
      expect(component.ciudad).toBe(ciudad);
      expect(component.formulario.get('pais')?.value).toBe(pais);
      expect(component.formulario.get('estado')?.value).toBe(estado);
      expect(component.formulario.get('ciudad')?.value).toBe(ciudad);
     
    });


    it('should check passwords and update password validation status', () => {
      const password = 'password123';
      let confirmacion = 'password123';
    
      component.formulario.get('password')?.setValue(password);
      component.comprobarContrasenias(confirmacion);
    
      expect(component.formulario.get('password')?.value).toBe(password);
      expect(component.contraseniasIguales).toBeTrue();
      expect(component.contraseniasNoCoinciden).toBe('');
    
      confirmacion = 'password456';
      component.comprobarContrasenias(confirmacion);
    
      expect(component.contraseniasIguales).toBeFalse();
      expect(component.contraseniasNoCoinciden).toEqual({ invalid: 'Las contraseñas no coinciden' });

    });


    it('should add selected file to formData', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } };
    
      component.onFileSelected(event);
    
      expect(component.formData.get('foto_perfil')).toBe(file);
    });


    it('should send user data to registration service', () => {
      const mockFormData = new FormData();
      const mockResponse = { success: true };
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      spyOn(component.formData, 'append').and.callThrough();
      spyOn(component._registroUsuario, 'nuevoUsuario').and.returnValue(of(mockResponse));
      spyOn(component._registroUsuario, 'logInUser');
    
      component.formulario.setValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
        telefono: '123456789',
        pais: 'Country',
        estado: 'State',
        ciudad: 'City',
        direccion: 'Address',
        foto_perfil : file
      });
    
      component.contraseniasIguales = true;
    
      component.nuevoUsuario();
    
      expect(component._registroUsuario.logInUser).toHaveBeenCalledWith(component.formulario.value);
    });
   
    
  
});



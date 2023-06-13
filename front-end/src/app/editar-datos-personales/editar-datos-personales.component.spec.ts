import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDatosPersonalesComponent } from './editar-datos-personales.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { of, throwError } from 'rxjs';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';

describe('EditarDatosPersonalesComponent', () => {
  let component: EditarDatosPersonalesComponent;
  let fixture: ComponentFixture<EditarDatosPersonalesComponent>;
  let autenticacionUsuariosService: AutenticacionUsuariosService;
  let httpMock: HttpTestingController;
  let perfilUsuarioService: PerfilUsuarioService;
  let router: Router;

  beforeEach(async () => {
    autenticacionUsuariosService = jasmine.createSpyObj('AutenticacionUsuariosService', ['getUsuario']);

    await TestBed.configureTestingModule({
      declarations: [ EditarDatosPersonalesComponent, CabeceraComponent, ContactosChatComponent ],
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
          FormBuilder,
          {
            provide: PerfilUsuarioService,
            useValue: {
              editarDatosPerfil: jasmine.createSpy('editarDatosPerfil').and.returnValue(of({})),
            }
          }
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
    router = TestBed.inject(Router);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize component with user data when credentials exist', () => {
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
    const credentials = { token: 'token', id: 1, username: 'testuser' };
    
    // Mock autenticacionUsuariosService
    const autenticacionUsuariosServiceSpy = jasmine.createSpyObj('autenticacionUsuariosService', ['obtenerCredenciales', 'getUsuario']);
    autenticacionUsuariosServiceSpy.obtenerCredenciales.and.returnValue(credentials);
    autenticacionUsuariosServiceSpy.getUsuario.and.returnValue(of(userData));
    
    // Replace the original service with the spy
    component._obtenerUsuario = autenticacionUsuariosServiceSpy;
    
    // Act
    component.ngOnInit();
    
    // Assert
    expect(component.datosUsuario).toEqual(userData);
    expect(component.pais).toBe(userData.pais);
    expect(component.estado).toBe(userData.estado);
    expect(component.ciudad).toBe(userData.ciudad);
    expect(component.formularioDatosUsuario.value.email).toBe(userData.email);
    expect(component.formularioDatosUsuario.value.first_name).toBe(userData.first_name);
    expect(component.formularioDatosUsuario.value.last_name).toBe(userData.last_name);
    expect(component.formularioDatosUsuario.value.telefono).toBe(userData.telefono);
    expect(component.formularioDatosUsuario.value.pais).toBe(userData.pais);
    expect(component.formularioDatosUsuario.value.estado).toBe(userData.estado);
    expect(component.formularioDatosUsuario.value.ciudad).toBe(userData.ciudad);
    expect(component.formularioDatosUsuario.value.direccion).toBe(userData.direccion);
  });


  
  it('should retrieve countries and set the value of "paises" property', () => {
    // Arrange
    const mockPaises = { results: ['Country 1', 'Country 2'] };
    const patchValueSpy = spyOn(component.formularioDatosUsuario, 'patchValue');

    // Act
    component.obtenerPais();

    // Assert
    const req = httpMock.expectOne('http://localhost:8000/paises/');
    expect(req.request.method).toBe('GET');
    req.flush(mockPaises);
    expect(component.paises).toEqual(mockPaises.results);
    expect(patchValueSpy).toHaveBeenCalledWith({ pais: component.pais });
  });






  it('should retrieve the list of states', () => {
    const mockEstados = {
      results: [
        { id: 1, nombre: 'Estado 1' },
        { id: 2, nombre: 'Estado 2' },
      ]
    };

    component.pais = 'nombrePais';
    component.obtenerEstado();

    const req = httpMock.expectOne(`http://localhost:8000/estados/?id_pais__nombre_pais=${component.pais}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEstados);

    expect(component.estados).toEqual(mockEstados.results);
  });


  it('should retrieve the list of cities', () => {
    const mockCiudades = {
      results: [
        { id: 1, nombre: 'Ciudad 1' },
        { id: 2, nombre: 'Ciudad 2' },
      ]
    };

    component.estado = 'nombreEstado';
    component.obtenerCiudad();

    const req = httpMock.expectOne('http://localhost:8000/ciudades/?id_estado__nombre_estado=nombreEstado');
    expect(req.request.method).toBe('GET');
    req.flush(mockCiudades);

    expect(component.ciudades).toEqual(mockCiudades.results);
  });



  it('should edit user data and navigate to "perfil-personal" on success', () => {
    spyOn(router, 'navigateByUrl');
    component.credenciales = { id: '1' };
    component.formularioDatosUsuario.setValue({
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '123456789',
      pais: 'Country',
      estado: 'State',
      ciudad: 'City',
      direccion: 'Address'
    });

    component.editarDatosUsuario();

    expect(perfilUsuarioService.editarDatosPerfil).toHaveBeenCalledWith('1', {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '123456789',
      pais: 'Country',
      estado: 'State',
      ciudad: 'City',
      direccion: 'Address'
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('perfil-personal');
  });



  it('should save address values in the form', () => {
    // Arrange
    const mockPais = 'Argentina';
    const mockCiudad = 'Buenos Aires';
  
    // Act
    component.pais = mockPais;
    component.ciudad = mockCiudad;
    component.guardarDireccionFormulario();
  
    // Assert
    const formValues = component.formularioDatosUsuario.value;
    expect(formValues.pais).toBe(mockPais);
    expect(formValues.ciudad).toBe(mockCiudad);
  });


});



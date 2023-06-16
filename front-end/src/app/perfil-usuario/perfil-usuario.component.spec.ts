import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { of } from 'rxjs';

describe('PerfilUsuarioComponent', () => {
  let component: PerfilUsuarioComponent;
  let fixture: ComponentFixture<PerfilUsuarioComponent>;
  let perfilUsuarioService: PerfilUsuarioService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioComponent, CabeceraComponent, ContactosChatComponent ],
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
        providers: [PerfilUsuarioService, Router]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
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

  it('should set contenidoCargado to true after 500ms', (done) => {
    const mockUserData = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '123456789',
      pais: 'Country',
      estado: 'State',
      ciudad: 'City',
      direccion: 'Address'
    };
    spyOn(perfilUsuarioService, 'getPerfilUsuario').and.returnValue(of(mockUserData));

    component.ngOnInit();

    expect(component.contenidoCargado).toBeFalsy();

    setTimeout(() => {
      expect(component.contenidoCargado).toBeTruthy();
      done();
    }, 500);
  });


  it('should send form data with selected file on file selection', () => {
    const mockFile = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [mockFile] } };
    const mockResponse = { status: 200 };
    spyOn(perfilUsuarioService, 'editarDatosPerfil').and.returnValue(of(mockResponse));
    spyOn(component, 'ngOnInit');

    component.formularioImagenUsuario.setValue({
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      telefono: '123456789',
      pais: 'Country',
      estado: 'State',
      ciudad: 'City',
      direccion: 'Address',
      foto_perfil:mockFile
    });

    component.onFileSelected(event);

    expect(perfilUsuarioService.editarDatosPerfil).toHaveBeenCalledWith(
      component.datosUsuario?.id,
      jasmine.any(FormData)
    );

    const formData: FormData = (perfilUsuarioService.editarDatosPerfil as jasmine.Spy).calls.mostRecent().args[1];
    expect(formData.get('email')).toEqual('test@example.com');
    expect(formData.get('first_name')).toEqual('John');
    expect(formData.get('last_name')).toEqual('Doe');
    expect(formData.get('telefono')).toEqual('123456789');
    expect(formData.get('pais')).toEqual('Country');
    expect(formData.get('estado')).toEqual('State');
    expect(formData.get('ciudad')).toEqual('City');
    expect(formData.get('direccion')).toEqual('Address');
    expect(formData.get('foto_perfil')).toEqual(mockFile);

    expect(component.ngOnInit).toHaveBeenCalled();
  });


  it('should remove user data from localStorage and navigate to login on logout', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(component.router, 'navigateByUrl');
  
    component.logout();
  
    expect(localStorage.removeItem).toHaveBeenCalledWith('userData');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/login');
  });


});

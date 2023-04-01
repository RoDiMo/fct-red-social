import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioComponent } from './registro-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

describe('RegistroUsuarioComponent', () => {
  let component: RegistroUsuarioComponent;
  let fixture: ComponentFixture<RegistroUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUsuarioComponent ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule
        ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create the form with empty fields', () => {
    expect(component.formulario.get('username')?.value).toBe('');
    expect(component.formulario.get('email')?.value).toBe('');
    expect(component.formulario.get('password')?.value).toBe('');
    expect(component.formulario.get('first_name')?.value).toBe('');
    expect(component.formulario.get('last_name')?.value).toBe('');
    expect(component.formulario.get('telefono')?.value).toBe('');
    expect(component.formulario.get('pais')?.value).toBe('');
    expect(component.formulario.get('estado')?.value).toBe('');
    expect(component.formulario.get('ciudad')?.value).toBe('');
    expect(component.formulario.get('direccion')?.value).toBe('');
    expect(component.formulario.get('foto_perfil')?.value).toBe('');
  });

  it('should set the value of "foto_perfil" control', () => {
    const imagen ="";
    const event = { target: { files: [imagen] } };
    component.onChange(event);
    expect(component.formulario.get('foto_perfil')?.value).toEqual(imagen);
  });


  it('should call "registroUsuario.nuevoUsuario()" method with form data', () => {
    spyOn(component.registroUsuario, 'nuevoUsuario').and.callThrough();

    const formData = new FormData();

    component.formulario.setValue({
      username: 'usuario1',
      email: 'usuario1@mail.com',
      password: '123456',
      first_name: 'Usuario',
      last_name: 'Uno',
      telefono: '123456789',
      pais: 'País',
      estado: 'Estado',
      ciudad: 'Ciudad',
      direccion: 'Dirección',
      foto_perfil: ''
    });

    component.nuevoUsuario();

    expect(component.registroUsuario.nuevoUsuario).toHaveBeenCalledWith(formData);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuarios } from './home';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

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
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
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




});

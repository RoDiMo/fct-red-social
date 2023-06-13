import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrearComentarioComponent } from './crear-comentario.component';
import { ComentariosService } from '../comentarios.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';

import { AppRoutingModule } from '../app-routing.module';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

describe('CrearComentarioComponent', () => {
  let component: CrearComentarioComponent;
  let fixture: ComponentFixture<CrearComentarioComponent>;


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
      

    }).compileComponents();
    fixture = TestBed.createComponent(CrearComentarioComponent);
    component = fixture.componentInstance;
    
  // Establecer un valor para 'id' antes de llamar a ngOnInit()

  

    component.ngOnInit();
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

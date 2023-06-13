import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraseniaComponent } from './cambiar-contrasenia.component';
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

describe('CambiarContraseniaComponent', () => {
  let component: CambiarContraseniaComponent;
  let fixture: ComponentFixture<CambiarContraseniaComponent>;
  let perfilUsuarioService: PerfilUsuarioService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarContraseniaComponent, CabeceraComponent, ContactosChatComponent ],
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

    fixture = TestBed.createComponent(CambiarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería editar los datos de usuario y redirigir a la página de login', () => {
    // Espía el método "editarDatosPerfil" del servicio PerfilUsuarioService
    const editarDatosPerfilSpy = spyOn(perfilUsuarioService, 'editarDatosPerfil').and.returnValue(of({}));

    // Espía el método "navigateByUrl" de router
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    // Establece los valores necesarios en el componente
    component.credenciales = { id: '123' };
    component.formularioDatosUsuario.setValue({
      password: 'nuevaContraseña123'
    });
    // Llama al método a probar
    component.editarDatosUsuario();

    // Comprueba que se llame a "editarDatosPerfil" con los argumentos correctos
    expect(editarDatosPerfilSpy).toHaveBeenCalledWith('123', component.formularioDatosUsuario.value);


    // Comprueba que se llame a "navigateByUrl" con el argumento correcto
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
  });


  
});

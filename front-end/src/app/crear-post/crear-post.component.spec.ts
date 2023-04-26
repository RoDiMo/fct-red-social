import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPostComponent } from './crear-post.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { of } from 'rxjs';


describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPostComponent ],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set user id in form value', () => {
    // mock credenciales
    component.obtenerCredenciales.obtenerCredenciales = () => ({ id: 1 });

    // mock perfil de usuario
    const perfilUsuario = { id: 1 };
    spyOn(component.obtenerUsuario, 'getPerfilUsuario').and.returnValue(of(perfilUsuario));

    component.ngOnInit();

    expect(component.formularioPost.value.usuario).toBe(`http://localhost:8000/usuarios/${perfilUsuario.id}/`);
  });





});

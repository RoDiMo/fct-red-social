import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrearComentarioComponent } from './crear-comentario.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { ComentariosService } from '../comentarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { of } from 'rxjs';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CrearComentarioComponent', () => {
  let component: CrearComentarioComponent;
  let fixture: ComponentFixture<CrearComentarioComponent>;
  let obtenerUsuarioSpy: jasmine.Spy;
  let obtenerCredencialesSpy: jasmine.Spy;
  let publicarComentarioSpy: jasmine.SpyObj<ComentariosService>;
  let httpMock: HttpTestingController;
  let comentariosService: ComentariosService;

  beforeEach(async () => {

    const perfilUsuarioService = jasmine.createSpyObj('PerfilUsuarioService', ['getPerfilUsuario']);
    const obtenerUsuarioSpy = perfilUsuarioService.getPerfilUsuario.and.returnValue(
      of(new PerfilUsuario('1', 'testuser', 'testpassword', 'Test', 'User', 'testuser@example.com', '123456', false, 'Argentina', 'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Av. Siempreviva 742', null))
    );
    
    const obtenerCredencialesSpy = jasmine.createSpyObj('AutenticacionUsuariosService', ['obtenerCredenciales']);
    obtenerCredencialesSpy.obtenerCredenciales.and.returnValue({
      id: '1',
      token: 'xyz123'
    });


    await TestBed.configureTestingModule({
      declarations: [ CrearComentarioComponent ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientTestingModule 

        ],
        providers: [
          CrearComentarioComponent, 
          ComentariosService,
        FormBuilder,
        { provide: PerfilUsuarioService, useValue: perfilUsuarioService },
        { provide: AutenticacionUsuariosService, useValue: obtenerCredencialesSpy },
        { provide: ComentariosService, useValue: jasmine.createSpyObj('ComentariosService', ['publicarComentario']) }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ComentariosService ]
    });

    fixture = TestBed.createComponent(CrearComentarioComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    comentariosService = TestBed.inject(ComentariosService);
    fixture.detectChanges();
    obtenerUsuarioSpy = TestBed.inject(PerfilUsuarioService).getPerfilUsuario as jasmine.Spy;
    obtenerCredencialesSpy = TestBed.inject(AutenticacionUsuariosService).obtenerCredenciales as jasmine.Spy;
    publicarComentarioSpy = jasmine.createSpyObj('ComentariosService', ['nuevoComentario']);
    const formBuilder = new FormBuilder();

    
  });


  afterEach(() => {
    httpMock.verify();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the form with default values when credentials and user are obtained', fakeAsync(() => {
    component.ngOnInit();
    expect(component.formularioComent.controls['post'].value).toEqual('http://localhost:8000/posts/2/');

  }));


  
});

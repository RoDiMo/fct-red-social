import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CabeceraComponent } from './cabecera.component';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AmigosService } from '../amigos.service';
import { NotificacionesService } from '../notificaciones.service';
import { ChatService } from '../chat.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

describe('CabeceraComponent', () => {
  let component: CabeceraComponent;
  let fixture: ComponentFixture<CabeceraComponent>;
  let autenticacionUsuariosService: AutenticacionUsuariosService;
  let perfilUsuarioService: PerfilUsuarioService;
  let amigosService: AmigosService;
  let notificacionesService: NotificacionesService;
  let chatService: ChatService;
  let modal: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabeceraComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AutenticacionUsuariosService,
        PerfilUsuarioService,
        AmigosService,
        NotificacionesService,
        ChatService,
        NgbModal,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabeceraComponent);
    component = fixture.componentInstance;
    autenticacionUsuariosService = TestBed.inject(AutenticacionUsuariosService);
    perfilUsuarioService = TestBed.inject(PerfilUsuarioService);
    amigosService = TestBed.inject(AmigosService);
    notificacionesService = TestBed.inject(NotificacionesService);
    chatService = TestBed.inject(ChatService);
    modal = TestBed.inject(NgbModal);

    spyOn(autenticacionUsuariosService, 'obtenerCredenciales').and.returnValue({
      id: '1',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerUsuarioRegistrado on ngOnInit', () => {
    spyOn(component, 'obtenerUsuarioRegistrado');
    fixture.detectChanges();
  
    // Asignar un valor a this.credenciales
    component.credenciales = { id: '1' }; // Puedes ajustar el valor según tus necesidades
  
    // Volver a llamar a fixture.detectChanges() para que se apliquen los cambios
    fixture.detectChanges();
  
    expect(component.obtenerUsuarioRegistrado).toHaveBeenCalled();
  });



})


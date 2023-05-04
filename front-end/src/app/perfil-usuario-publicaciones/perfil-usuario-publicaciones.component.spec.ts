import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilUsuarioPublicacionesComponent } from './perfil-usuario-publicaciones.component';

describe('PerfilUsuarioPublicacionesComponent', () => {
  let component: PerfilUsuarioPublicacionesComponent;
  let fixture: ComponentFixture<PerfilUsuarioPublicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioPublicacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilUsuarioPublicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

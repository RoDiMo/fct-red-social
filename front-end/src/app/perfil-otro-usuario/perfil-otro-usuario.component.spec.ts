import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilOtroUsuarioComponent } from './perfil-otro-usuario.component';

describe('PerfilOtroUsuarioComponent', () => {
  let component: PerfilOtroUsuarioComponent;
  let fixture: ComponentFixture<PerfilOtroUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilOtroUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilOtroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

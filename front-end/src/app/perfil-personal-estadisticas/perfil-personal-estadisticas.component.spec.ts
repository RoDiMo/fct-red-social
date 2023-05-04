import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPersonalEstadisticasComponent } from './perfil-personal-estadisticas.component';

describe('PerfilPersonalEstadisticasComponent', () => {
  let component: PerfilPersonalEstadisticasComponent;
  let fixture: ComponentFixture<PerfilPersonalEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilPersonalEstadisticasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPersonalEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDatosPersonalesComponent } from './editar-datos-personales.component';

describe('EditarDatosPersonalesComponent', () => {
  let component: EditarDatosPersonalesComponent;
  let fixture: ComponentFixture<EditarDatosPersonalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarDatosPersonalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

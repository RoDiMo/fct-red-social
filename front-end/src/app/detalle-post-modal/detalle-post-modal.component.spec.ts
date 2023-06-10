import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePostModalComponent } from './detalle-post-modal.component';

describe('DetallePostModalComponent', () => {
  let component: DetallePostModalComponent;
  let fixture: ComponentFixture<DetallePostModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePostModalComponent]
    });
    fixture = TestBed.createComponent(DetallePostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

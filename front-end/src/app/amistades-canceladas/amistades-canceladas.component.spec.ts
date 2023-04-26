import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmistadesCanceladasComponent } from './amistades-canceladas.component';

describe('AmistadesCanceladasComponent', () => {
  let component: AmistadesCanceladasComponent;
  let fixture: ComponentFixture<AmistadesCanceladasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmistadesCanceladasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmistadesCanceladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosChatComponent } from './contactos-chat.component';

describe('ContactosChatComponent', () => {
  let component: ContactosChatComponent;
  let fixture: ComponentFixture<ContactosChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactosChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

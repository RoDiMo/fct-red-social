import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosChatModalComponent } from './contactos-chat-modal.component';

describe('ContactosChatModalComponent', () => {
  let component: ContactosChatModalComponent;
  let fixture: ComponentFixture<ContactosChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactosChatModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

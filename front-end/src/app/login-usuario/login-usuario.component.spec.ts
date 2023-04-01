import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUsuarioComponent } from './login-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LoginUsuarioComponent', () => {
  let component: LoginUsuarioComponent;
  let fixture: ComponentFixture<LoginUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginUsuarioComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule , 
        ReactiveFormsModule,
        ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUsuarioComponent } from './login-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

describe('LoginUsuarioComponent', () => {
  let component: LoginUsuarioComponent;
  let fixture: ComponentFixture<LoginUsuarioComponent>;
  let loginUsuarioService: AutenticacionUsuariosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginUsuarioComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [AutenticacionUsuariosService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginUsuarioComponent);
    component = fixture.componentInstance;
    loginUsuarioService = TestBed.inject(AutenticacionUsuariosService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle form submission with invalid form', () => {
    // Simulate invalid form
    component.logInForm.setErrors({ someError: 'Invalid form' });

    spyOn(console, 'log'); // Spy on console.log method

    // Call the onSubmit method
    component.onSubmit({});

    expect(console.log).toHaveBeenCalledWith(component.logInForm.errors);
  });

  it('should handle form submission with valid form', async () => {
    // Simulate valid form
    component.logInForm.setErrors(null);

    // Mock loginUsuario service
    spyOn(loginUsuarioService, 'logInUser').and.returnValue(Promise.resolve());

    // Antes de llamar al método onSubmit
    component.logInForm.controls['username'].setValue('username-value');
    component.logInForm.controls['password'].setValue('password-value');

    // Llamar al método onSubmit
    component.onSubmit(component.logInForm.value);

    // Call the onSubmit method
    await component.onSubmit({});

    expect(loginUsuarioService.logInUser).toHaveBeenCalled();
  });



});

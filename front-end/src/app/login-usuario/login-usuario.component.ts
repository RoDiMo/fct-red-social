import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, } from "@angular/forms";
import { AutenticacionUsuariosService } from "../autenticacion-usuarios.service";
import { UserCredentials } from "../auth";
import { Router } from "@angular/router";
import { Location } from '@angular/common';


@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css'],
})
export class LoginUsuarioComponent implements OnInit {
  logInForm;
  httpResponse: any;
  mostrarContrasenia: boolean = false

  constructor(private formBuilder: FormBuilder, 
    private loginUsuario: AutenticacionUsuariosService,
    private router: Router,
    private location: Location,) {
    this.logInForm = this.formBuilder.group({
      username: ['' as string | null, Validators.required],
      password: ['' as string | null, Validators.required]
    });
  }


  ngOnInit(): void {
    this.location.replaceState(`/`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'inicio');
 
  }

  // Al rellenar el formulario de inicio de sesion se llama a la funcion logInUser

  onSubmit(formData: any): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.loginUsuario.logInUser(formData)
        .then((response) => {
          // La promesa se resolvió correctamente, no hay error del servidor
        })
        .catch((error) => {
          // La promesa se rechazó debido a un error del servidor
          this.httpResponse = error.error.non_field_errors; // Asigna la respuesta del servidor a la variable httpResponse
        });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,  } from "@angular/forms";
import { AutenticacionUsuariosService } from "../autenticacion-usuarios.service";
import { UserCredentials } from "../auth";
import { Router } from "@angular/router";



@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css'],
})
export class LoginUsuarioComponent implements OnInit{
  logInForm ;
  constructor(private formBuilder: FormBuilder, private loginUsuario: AutenticacionUsuariosService, private router: Router ) {
   this.logInForm = this.formBuilder.group({
     username: ['' as string | null, Validators.required],
     password: ['' as string | null, Validators.required]
   });
  }


  ngOnInit(): void {
  }

  /*
  // Metodo que agrega las credenciales de un usuario al Local Storage
  logInUser(user: UserCredentials): void {
    this.autenticacionUsuariosService.logIn(user.username, user.password).subscribe({
      next: (data) => {
        this.autenticacionUsuariosService.setLoggedInUser(data);
        this.router.navigateByUrl(`/perfil-personal/${data.id}`);
      },
      error: (error) => {
        
        console.log(error);
      }
    }
    );
   }
*/
   // Al rellenar el formulario de inicio de sesion se llama a la funcion logInUser
   onSubmit(formData:any): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.loginUsuario.logInUser(formData);
    }
  }
  
}

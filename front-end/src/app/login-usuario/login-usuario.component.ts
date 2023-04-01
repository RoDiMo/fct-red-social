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
  constructor(private formBuilder: FormBuilder, private autenticacionUsuariosService: AutenticacionUsuariosService, private router: Router ) {
   this.logInForm = this.formBuilder.group({
     username: ['' as string | null, Validators.required],
     password: ['' as string | null, Validators.required]
   });
  }


  ngOnInit(): void {
  }

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

   //Hay que controlar de que solo le lleguen datos tipo string
   onSubmit(formData:any): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else {
      this.logInUser(formData);
    }
  }
  
}

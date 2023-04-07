import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { UserCredentials } from '../auth';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styles: [
  ]
})
export class RegistroUsuarioComponent {

  public formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _registroUsuario: AutenticacionUsuariosService,
  ) {}

  ngOnInit() {

    // Datos del formulario de registro del usuario
    this.formulario = this.fb.group({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      first_name : new FormControl(''),
      last_name : new FormControl(''),
      telefono : new FormControl(''),
      pais :new FormControl(''),
      estado : new FormControl(''),
      ciudad :new FormControl(''),
      direccion : new FormControl(''),

    })
  }


  nuevoUsuario(formData: any){
    this._registroUsuario.nuevoUsuario(this.formulario.value).subscribe(data =>{
      this._registroUsuario.logInUser(formData)
    });
  }

  }




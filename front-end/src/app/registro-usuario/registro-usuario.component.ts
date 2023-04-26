import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { UserCredentials } from '../auth';
import { HttpErrorResponse } from '@angular/common/http';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, } from '@angular/forms';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styles: [
  ]
})
export class RegistroUsuarioComponent {

  public formulario!: FormGroup;
  public formData: FormData = new FormData();
 
  public mensajeInfo = "";
  public errors : Array<any> = [];

  constructor(
    public fb: FormBuilder,
    public _registroUsuario: AutenticacionUsuariosService,
  ) { }

  ngOnInit() {

    // Datos del formulario de registro del usuario
    this.formulario = this.fb.group({
      username: ['' as string | null, Validators.required],
      email: ['' as string | null, Validators.required],
      password: ['' as string | null, Validators.required],
      first_name: ['' as string | null, Validators.required],
      last_name: ['' as string | null, Validators.required],
      telefono: ['' as string | null, Validators.required],
      pais: ['' as string | null, Validators.required],
      estado: ['' as string | null, Validators.required],
      ciudad: ['' as string | null, Validators.required],
      direccion: ['' as string | null, Validators.required],
      foto_perfil: null,

    })
  }


  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (file != null) {
      this.formData.append('foto_perfil', file);


      //this.formularioPost.get('imagen')?.setValue(file); // se asigna el archivo seleccionado a su campo del formulario
    }
  }

  nuevoUsuario() {

    this.formData.append('username', this.formulario.get('username')?.value);
    this.formData.append('email', this.formulario.get('email')?.value);
    this.formData.append('password', this.formulario.get('password')?.value);
    this.formData.append('first_name', this.formulario.get('first_name')?.value);
    this.formData.append('last_name', this.formulario.get('last_name')?.value);
    this.formData.append('telefono', this.formulario.get('telefono')?.value);
    this.formData.append('pais', this.formulario.get('pais')?.value);
    this.formData.append('estado', this.formulario.get('estado')?.value);
    this.formData.append('ciudad', this.formulario.get('ciudad')?.value);
    this.formData.append('direccion', this.formulario.get('direccion')?.value);


    if (this.formulario.invalid) {
      console.log(this.formulario.errors);
      this.mensajeInfo = "Formulario no válido"
    } else {
      this._registroUsuario.nuevoUsuario(this.formData).subscribe(data => {
        this._registroUsuario.logInUser(this.formulario.value)
      }, err => {
        if (err instanceof HttpErrorResponse) {
          const ValidationErrors = err.error;
          Object.keys(ValidationErrors).forEach(prop => {
            const formControl = this.formulario.get(prop);
            if (formControl) {
              formControl.setErrors({
                serverError: ValidationErrors[prop]
              })
            }
          })
        }
        this.errors = err.error.message;
      });
    }
  }

}


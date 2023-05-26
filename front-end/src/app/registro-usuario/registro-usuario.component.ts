import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { UserCredentials } from '../auth';
import { HttpErrorResponse } from '@angular/common/http';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, } from '@angular/forms';
import { ObtenerDireccionService } from '../obtener-direccion.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styles: [
  ]
})
export class RegistroUsuarioComponent {

  public formulario!: FormGroup;
  public formData: FormData = new FormData();
 
  public contraseniaVacia = {};
  public confirmacionVacia = {};
  public contraseniasNoCoinciden = {}
  public errors : Array<any> = [];

  public confirmarContrasenia : String = "";
  public contraseniasIguales : boolean = false;

  public paises: Array<any> = []
  public estados: Array<any> = []
  public ciudades: Array<any> = []

  public pais!: string
  public estado!: string
  public ciudad!: string

  constructor(
    public fb: FormBuilder,
    public _registroUsuario: AutenticacionUsuariosService,
    public _obtenerDireccionService: ObtenerDireccionService,
  ) { }

  ngOnInit() {

    // Datos del formulario de registro del usuario
    this.formulario = this.fb.group({
      username: ['' as string | null, Validators.required],
      email: ['' as string | null, Validators.required],
      password: ['', Validators.required],
      first_name: ['' as string | null, Validators.required],
      last_name: ['' as string | null, Validators.required],
      telefono: ['' as string | null, Validators.required],
      pais: ['' as string | null, Validators.required],
      estado: ['' as string | null, Validators.required],
      ciudad: ['' as string | null, Validators.required],
      direccion: ['' as string | null, Validators.required],
      foto_perfil: null,
    });

    this.obtenerPais()
    
  }


  obtenerPais(){
    this._obtenerDireccionService.obtenerPaises().subscribe(paises => {
      this.paises = paises.results
      
      this.formulario.patchValue({
        pais: this.pais
      })

   
    })
  }

  obtenerEstado(){
    this.formulario.patchValue({
      pais: this.pais
    })

    this._obtenerDireccionService.obtenerEstados(this.pais).subscribe(estados => {
      this.estados = estados.results
      console.log(this.estados)
    })
    console.log(this.formulario.get("pais")?.value)
  }


  obtenerCiudad(){
    console.log(this.estado)

    this.formulario.patchValue({
      estado: this.estado
    })

    this._obtenerDireccionService.obtenerCiudades(this.estado).subscribe(ciudades => {
      this.ciudades = ciudades.results
      console.log(this.ciudades)
    })

  }


  guardarDireccionFormulario(){
    this.formulario.patchValue({
      pais: this.pais,
      estado: this.estado,
      ciudad: this.ciudad,
    })

    console.log(this.formulario.value)
  }

  /**
   * Método que comprueba que tanto la contraseña como su ocnfirmación son iguales
   * @param confirmacion Valor de la confirmación de la contraseña
   */
  comprobarContrasenias(confirmacion: String){
    console.log(this.formulario.get("password")?.value, confirmacion)
    if (confirmacion == this.formulario.get("password")?.value){
      this.contraseniasIguales = true
      this.contraseniasNoCoinciden = ""
    
    }else{
      this.contraseniasIguales = false
  
      this.contraseniasNoCoinciden = {invalid: "Las contraseñas no coinciden"}
    }

    console.log(this.contraseniasIguales)
  }



  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (file != null) {
      this.formData.append('foto_perfil', file);


      //this.formularioPost.get('imagen')?.setValue(file); // se asigna el archivo seleccionado a su campo del formulario
    }
  }

  nuevoUsuario() {
    console.log(this.formulario.value)
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

    if(!this.contraseniasIguales){
      this.contraseniasNoCoinciden = {invalid: "Las contraseñas no coinciden"}
    }else{
      this.contraseniasNoCoinciden = ""
    }
    //else {
    this.contraseniaVacia = {}
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
    //}

    
  }


  protected readonly Object = Object;
}


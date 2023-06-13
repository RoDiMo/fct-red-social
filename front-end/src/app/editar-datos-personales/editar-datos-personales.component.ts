import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObtenerDireccionService } from '../obtener-direccion.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-editar-datos-personales',
  templateUrl: './editar-datos-personales.component.html',
  styles: [
  ]
})
export class EditarDatosPersonalesComponent {
  
  public datosUsuario!: PerfilUsuario;
  public credenciales = this._obtenerUsuario.obtenerCredenciales();
  public formularioDatosUsuario! : FormGroup; 

  public paises: Array<any> = []
  public estados: Array<any> = []
  public ciudades: Array<any> = []
  public errors : Array<any> = [];

  public pais!: string
  public estado!: string
  public ciudad!: string


  constructor(
    public _perfilUsuarioService: PerfilUsuarioService,
    public _obtenerUsuario : AutenticacionUsuariosService,
    public _obtenerDireccionService: ObtenerDireccionService,
    public router: Router,
    public formBuilder: FormBuilder,
  ){
    this.formularioDatosUsuario = this.formBuilder.group({
      email: ['' as string | null, Validators.required],
      first_name: ['' as string | null, Validators.required],
      last_name: ['' as string | null, Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,15}$')]],
      pais: ['' as string | null, Validators.required],
      estado: ['' as string | null, Validators.required],
      ciudad: ['' as string | null, Validators.required],
      direccion: ['' as string | null, Validators.required],
    })
  }
  

  ngOnInit(): void {
    if(!this.credenciales){
      this.credenciales = {"token":"8f78c9b24891cc8041ec9d3e39b4ee07b045de7b","id":0,"username":"pruebatest"}
    }
   this._obtenerUsuario.getUsuario(this.credenciales.id).subscribe( data => {
    this.datosUsuario = data
    this.pais = this.datosUsuario.pais
    this.estado = this.datosUsuario.estado
    this.ciudad = this.datosUsuario.ciudad

    this.formularioDatosUsuario.patchValue({
      email: this.datosUsuario.email!,
      first_name: this.datosUsuario.first_name!,
      last_name: this.datosUsuario.last_name!,
      telefono: this.datosUsuario.telefono!,
      pais: this.datosUsuario.pais!,
      estado: this.datosUsuario.estado!,
      ciudad: this.datosUsuario.ciudad!,
      direccion: this.datosUsuario.direccion!,
    })

    this.obtenerPais();
    this.obtenerEstado();
    this.obtenerCiudad();
   })
  } 

    // Obtenemos el valor del país del usuario 
    obtenerPais(){
   
    this._obtenerDireccionService.obtenerPaises().subscribe(paises => {
      this.paises = paises.results
      
      this.formularioDatosUsuario.patchValue({
        pais: this.pais
      })

   
    })
  }

  // Obtenemos el valor del estado del usuario 
  obtenerEstado(){
    this.ciudades = []
    console.log(this.ciudades)
    this.formularioDatosUsuario.patchValue({
      pais: this.pais
    })
   
    this._obtenerDireccionService.obtenerEstados(this.pais).subscribe(estados => {
      this.estados = estados.results
    
    })

  }


  // Obtenemos el valor de la ciudad del usuario 
  obtenerCiudad(){


    this.formularioDatosUsuario.patchValue({
      estado: this.estado
    })

    this._obtenerDireccionService.obtenerCiudades(this.estado).subscribe(ciudades => {
      this.ciudades = ciudades.results
   
    })

  }

  // Guarda los datos de los selects con la direccion en el formulario
  guardarDireccionFormulario(){
    this.formularioDatosUsuario.patchValue({
      pais: this.pais,
      ciudad: this.ciudad,
    })
  }


  // Editamos y guardamos los datos del usuario
  editarDatosUsuario(){
    this._perfilUsuarioService.editarDatosPerfil(this.credenciales.id, this.formularioDatosUsuario.value).subscribe(data =>{
      this.router.navigateByUrl('perfil-personal');
    }, err => {
      if (err instanceof HttpErrorResponse) {
        const ValidationErrors = err.error;
        Object.keys(ValidationErrors).forEach(prop => {
          const formControl = this.formularioDatosUsuario.get(prop);
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
  

  protected readonly Object = Object;

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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


  constructor(
    public _perfilUsuarioService: PerfilUsuarioService,
    public _obtenerUsuario : AutenticacionUsuariosService,
    public router: Router,
    public formBuilder: FormBuilder,
  ){
    this.formularioDatosUsuario = this.formBuilder.group({
      email: ['' as string | null, Validators.required],
      first_name: ['' as string | null, Validators.required],
      last_name: ['' as string | null, Validators.required],
      telefono: ['' as string | null, Validators.required],
      pais: ['' as string | null, Validators.required],
      estado: ['' as string | null, Validators.required],
      ciudad: ['' as string | null, Validators.required],
      direccion: ['' as string | null, Validators.required],
    })
  }
  

  ngOnInit(): void {
   this._obtenerUsuario.getUsuario(this.credenciales.id).subscribe( data => {
    this.datosUsuario = data


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
   })
  } 


  editarDatosUsuario(){
    this._perfilUsuarioService.editarDatosPerfil(this.credenciales.id, this.formularioDatosUsuario.value).subscribe();
    this.router.navigateByUrl(`perfil-personal/${this.credenciales.id}`);
  }

}

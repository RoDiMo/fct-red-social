import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styles: [
  ]
})
export class CambiarContraseniaComponent {

  public datosUsuario!: PerfilUsuario;
  public credenciales = this._obtenerUsuario?.obtenerCredenciales();
  public formularioDatosUsuario! : FormGroup; 
  public errors : Array<any> = [];
  mostrarContrasenia: boolean = false

  constructor(
    public _perfilUsuarioService: PerfilUsuarioService,
    public _obtenerUsuario : AutenticacionUsuariosService,
    public router: Router,
    public formBuilder: FormBuilder,
  ){
    const patronContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\-=_+{};':"|,.<>?]).{8,}$/;

    this.formularioDatosUsuario = this.formBuilder.group({
      password: ['' as string, [Validators.required, Validators.pattern(patronContraseña)]],
    })
  }

  // Editamos los datos de la contraseña y redirigimos a la página de login
  editarDatosUsuario(){
    this._perfilUsuarioService.editarDatosPerfil(this.credenciales?.id, this.formularioDatosUsuario.value).subscribe( data => {
      
      localStorage.removeItem("userData");
      this.router.navigateByUrl(`/login`);
    })
   

  }
  

}

import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AmigosService } from '../amigos.service';
import { Amigo } from '../amigos/amigo';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styles: [
  ]
})
export class CabeceraComponent {

  public datosUsuario!: PerfilUsuario;
  public credenciales = this._obtenerUsuarioService.obtenerCredenciales();
  public tablaAmigos!: Array<Amigo>;
  public usuariosAmigos: Array<PerfilUsuario> = []
  public mouseover!: boolean;
  public esAdmin: boolean = false;

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    private router: Router,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.obtenerUsuarioRegistrado()
  }

  //Obtenemos los datos del usuario logueado
  obtenerUsuarioRegistrado() {

    this._obtenerUsuarioService.getUsuario(this.credenciales.id).subscribe(data => {
      this.datosUsuario = data
      if (this.datosUsuario.is_staff || this.datosUsuario.es_moderador) {
        this.esAdmin = true
      }
    })
  }

  // -------- ENLACES DE LA CABECERA --------

  enlaceInicio() {

    this.location.replaceState(`/`);
    location.reload();
  }

  enlaceNotificaciones() {

    this.location.replaceState(`/notificaciones`);
    location.reload();
  }

  enlacePerfil() {
    this.location.replaceState(`/perfil-personal`);
    location.reload();
  }

  enlaceAmigos() {

    this.location.replaceState(`/amigos`);
    location.reload();
  }

  enlacePublicaciones() {

    this.location.replaceState(`/perfil-usuario-publicaciones/${this.credenciales.id}`);
    location.reload();
  }

  enlaceAdministracion() {

    this.location.replaceState(`/admin-posts`);
    location.reload();
  }

  enlaceFormularioPost() {

    this.location.replaceState(`/formulario-post`);
    location.reload();

  }

  // Removemos los datos usuario del LocalStorage y lo redirigimos a la página de login
  logout() {
    localStorage.removeItem("userData");
    this.router.navigateByUrl(`/login`);
  }

}

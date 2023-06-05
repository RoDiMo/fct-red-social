import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AmigosService } from '../amigos.service';
import { Amigo } from '../amigos/amigo';
import { Location } from '@angular/common';
import { NotificacionesService } from '../notificaciones.service';

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
  public numNotificaciones: string = ""; 
  public pagina = localStorage.getItem(`enlace-cabecera`);

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _notificacionesService: NotificacionesService,
    private router: Router,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.obtenerUsuarioRegistrado()
    this.obtenerNumNotificaciones()

  }

  obtenerNumNotificaciones(){
    this._notificacionesService.obtenerNotificacionesUsuarioDestino(this.credenciales.id).subscribe(notificaciones =>{
      this.numNotificaciones = notificaciones.count
    })
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
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'inicio');
    location.reload();
  }

  enlaceNotificaciones() {

    this.location.replaceState(`/notificaciones`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'notificaciones');
    location.reload();
  }

  enlacePerfil() {
    this.location.replaceState(`/perfil-personal`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-personal');
    location.reload();
  }

  enlaceAmigos() {

    this.location.replaceState(`/amigos`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'amigos');
    location.reload();
  }

  enlacePublicaciones() {

    this.location.replaceState(`/perfil-usuario-publicaciones/${this.credenciales.id}`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-usuario-publicaciones');
    location.reload();
  }

  enlaceAdministracion() {
    
    this.location.replaceState(`/admin-posts`);
    localStorage.removeItem(`enlace-cabecera`)
  
    location.reload();
  }

  enlaceFormularioPost() {

    this.location.replaceState(`/formulario-post`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'formulario-post');
    location.reload();

  }

  // Removemos los datos usuario del LocalStorage y lo redirigimos a la página de login
  logout() {
    localStorage.removeItem("userData");
    localStorage.removeItem(`enlace-cabecera`)
    this.router.navigateByUrl(`/login`);
  }

}

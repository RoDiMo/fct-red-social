import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Amigo } from '../amigos/amigo';
import { AmigosService } from '../amigos.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { NotificacionesService } from '../notificaciones.service';
import { url } from '../utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactos-chat',
  templateUrl: './contactos-chat.component.html',
  styles: [
  ]
})
export class ContactosChatComponent {
  public amigos: Array<PerfilUsuario> = [];
  public usuarios: Array<PerfilUsuario> = [];
  public usuariosAmigos: Array<Amigo> = [];
  public usuarioRegistrado!: PerfilUsuario;
  public credenciales = this._obtenerUsuarioService.obtenerCredenciales();
  public url = url()

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
    public _notificacionesService: NotificacionesService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.gestionarUsuarios()

  }

    /**
   * Función que gestiona todo el proceso de gestión de amistades
   */
    gestionarUsuarios() {

      //Obtenemos los datos del usuario logueado
      this._obtenerUsuarioService.getUsuario(this.credenciales.id).subscribe(data => {
        this.usuarioRegistrado = data
  
        // Obtenemos las amistades del usuario registrado
        this.obtenerAmistades()
      })
    }


    // -------- GESTION DE AMISTADES

  /**
   * Función encargada de obtener las amistades del usuario registrado
   */
  obtenerAmistades() {

    // Obtenemos las coincidencias del usuario registrado en la tabla Amigos
    this._amigosService.obtenerAmistades(this.usuarioRegistrado.id).subscribe(data => {
      this.usuariosAmigos = data.results

      // Obtenemos los datos de los usuarios que figuren como amigos del usuario registrado
      this.aniadirUsuario(this.usuariosAmigos, this.amigos)

    })
  }


    /**
   * Función encargada de obtener los datos de Usuario de los amigos del usuario registrado
   * Comprueba también que usuarios no son amigos
   * @param amistades Coincidencias del usuario registrado en la tabla Amigos
   * @param amigos Datos de los usuarios amigos del usuario registrado
   */
    aniadirUsuario(amistades: any, amigos: any) {

      // Obtenemos los datos de usuarios de los amigos
      for (let amigo of amistades) {
        this._obtenerUsuarioService.getUsuarioUrl(amigo.usuario_receptor).subscribe(data => {
          amigos.push(data)
        })
      }
    }


    redirigirChat(idAmigo: string) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/chat/${idAmigo}`]);
      });
    }

}

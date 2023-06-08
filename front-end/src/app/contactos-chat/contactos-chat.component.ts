import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Amigo, AmigosChat } from '../amigos/amigo';
import { AmigosService } from '../amigos.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { NotificacionesService } from '../notificaciones.service';
import { url } from '../utils';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contactos-chat',
  templateUrl: './contactos-chat.component.html',
  styles: [
  ]
})
export class ContactosChatComponent {
  public amigos: Array<PerfilUsuario> = [];
  public usuarios: Array<PerfilUsuario> = [];
  public usuariosAmigos: Array<AmigosChat> = [];
  public usuarioRegistrado!: PerfilUsuario;
  public credenciales = this._obtenerUsuarioService.obtenerCredenciales();
  public url = url()

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
    public _notificacionesService: NotificacionesService,
    public _chatService: ChatService,
    public router: Router,
    public location: Location,
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

      for (let amigo of this.usuariosAmigos){
        this._chatService.obtenerMensajesNoLeidos(this.credenciales.id, amigo.datos_usuario_receptor.id).subscribe(numMensajes =>{
         
          amigo.numMensajesNoLeidos = numMensajes.length
          if(this.location.path()==(`/chat/${amigo.datos_usuario_receptor.id}`)){
            amigo.numMensajesNoLeidos = '0'
          }
          
       
        })
      }

    })
  }

    // Redirigimos a la id del usuario con el que queremos chatear
    redirigirChat(idAmigo: string) {

      this.location.replaceState(`/chat/${idAmigo}`)
      location.reload();
    }

}

import { Component } from '@angular/core';
import { NotificacionesService } from '../notificaciones.service';
import { AmigosService } from '../amigos.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { Notificacion } from './notificaciones';
import { Amigo } from '../amigos/amigo';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styles: [
  ]
})
export class NotificacionesComponent {

  public notificaciones: Array<Notificacion> = []
  public credencialesUsuario: any;
  public fecha = new Date();
  public notificacionActualizada: Array<Notificacion> = [];

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
    public _notificacionesService: NotificacionesService,

  ) { }


  ngOnInit() {
    this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
    this.obtenerNotificaciones()
  }


  obtenerNotificaciones() {
    this._notificacionesService.obtenerNotificacionesUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.notificaciones = data.results
      //console.log("notificaciones", this.notificaciones)

      for(let notificacion of this.notificaciones){
        this._obtenerUsuarioService.getUsuarioUrl(notificacion.usuario_origen).subscribe({
          next: (data) => {
            let usuarios = data.username

            // Obtenemos el nombre de cada usuario
            notificacion.nombre_usuario = usuarios
          }
        })
      }

    })
  }



  confirmarAmistad(idNotificacion: any,usuarioOrigen: string, usuarioDestino: string){

     
    let usuario_emisor = new Amigo(usuarioOrigen, usuarioDestino, this.fecha)
    let usuario_receptor = new Amigo(usuarioDestino, usuarioOrigen, this.fecha)

    this._amigosService.nuevaAmistad(usuario_emisor).subscribe()
    this._amigosService.nuevaAmistad(usuario_receptor).subscribe()

    this._notificacionesService.obtenerNotificacionPorId(idNotificacion).subscribe( data => {
      this.notificacionActualizada = [data]

      this.notificacionActualizada[0].estado = "Aceptada"
      this.notificacionActualizada[0].procesada = true

      this._notificacionesService.actualizarNotificacion(idNotificacion, this.notificacionActualizada[0]).subscribe()

    })
  


  /*
    setTimeout(() => {
      this.ngOnInit()
    }, 50)
    
*/
  }


}

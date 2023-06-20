import { Component } from '@angular/core';
import { NotificacionesService } from '../notificaciones.service';
import { AmigosService } from '../amigos.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { Notificacion } from './notificaciones';
import { Amigo } from '../amigos/amigo';
import { Router } from '@angular/router';

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
    public router: Router,

  ) { }


  ngOnInit() {
    this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
    this.obtenerNotificaciones()
  }

  // Obtenemos las notificaciones destinadas a este usuario que no han sido aún procesadas
  obtenerNotificaciones() {
    this._notificacionesService.obtenerNotificacionesUsuarioDestino(this.credencialesUsuario?.id).subscribe(data => {
      this.notificaciones = data.results

      // Obtenemos los datos del usuario que envio la notificacion
      for (let notificacion of this.notificaciones) {
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


  // Si el usuario confirma la amistad, se crea una nueva relacion en la base de datos y se pasa el estado de la notificacion a Aceptada
  confirmarAmistad(idNotificacion: any, usuarioOrigen: string, usuarioDestino: string) {


    let usuario_emisor = new Amigo(usuarioOrigen, usuarioDestino, this.fecha)
    let usuario_receptor = new Amigo(usuarioDestino, usuarioOrigen, this.fecha)

    this._amigosService.nuevaAmistad(usuario_emisor).subscribe()
    this._amigosService.nuevaAmistad(usuario_receptor).subscribe()

    // Una vez la solicitud es procesada se modifica su estado
    this._notificacionesService.obtenerNotificacionPorId(idNotificacion).subscribe(data => {
      this.notificacionActualizada = [data]

      this.notificacionActualizada[0].estado = "Aceptada"
      this.notificacionActualizada[0].procesada = true

      // Actualizamos la notificacion a procesada
      this._notificacionesService.actualizarNotificacion(idNotificacion, this.notificacionActualizada[0]).subscribe(notificacion =>{
        if (notificacion.status == 200) {

          this.ngOnInit() 
        }
      })

    })
  }

    // Si el usuario rechaza la amistad, pasa el estado de la notificacion a Rechazada
  rechazarAmistad(idNotificacion: any){
    this._notificacionesService.obtenerNotificacionPorId(idNotificacion).subscribe(data => {
      this.notificacionActualizada = [data]

      
    // Una vez la solicitud es procesada se modifica su estado
      this.notificacionActualizada[0].estado = "Rechazada"
      this.notificacionActualizada[0].procesada = true

      // Actualizamos la notificacion a procesada
      this._notificacionesService.actualizarNotificacion(idNotificacion, this.notificacionActualizada[0]).subscribe(notificacion=>{
        if (notificacion.status == 200) {
          this.ngOnInit() // Cambio por el reload
        }
      })





    })
  }

}

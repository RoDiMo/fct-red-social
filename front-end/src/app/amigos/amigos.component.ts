import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { AmigosService } from '../amigos.service';
import { Amigo } from './amigo';
import { AmistadesCanceladas } from '../amistades-canceladas/amistades-canceladas';
import { Notificacion } from '../notificaciones/notificaciones';
import { NotificacionesService } from '../notificaciones.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styles: [
  ]
})
export class AmigosComponent {
  public amigos: Array<PerfilUsuario> = [];
  public usuarios: Array<PerfilUsuario> = [];
  public noAmigos: Array<PerfilUsuario> = [];

  public recomendaciones: Array<PerfilUsuario> = [];
  public notificaciones: Array<Notificacion> = []
  public usuariosAmigos: Array<Amigo> = [];
  public usuarioRegistrado: any = {};
  public credencialesUsuario: any;
  public idAmistad: any = {};
  public fecha = new Date();
  public contenidoCargado: boolean = false;

  public valorBusqueda: string = ''

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
    public _notificacionesService: NotificacionesService,
    private location: Location,
    public router: Router,
  ) { }


  ngOnInit() {


    this.credencialesUsuario = this._obtenerUsuarioService?.obtenerCredenciales()
    this.obtenerUsuarioRegistrado()

    this.obtenerAmigos()
    this.obtenerNoAmigos(this.valorBusqueda)

  
    setTimeout(() => {
      this.contenidoCargado = true;
  
    }, 500)


  }

  enlacePerfil() {
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-personal');
    this.router.navigateByUrl(`/perfil-personal`);
  }

  enlaceEstadisticas() {
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-personal');
    this.router.navigateByUrl(`/perfil-personal-estadisticas`);
  }

  


  // Función donde Obtenemos los datos del usuario logueado
  obtenerUsuarioRegistrado() {

    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario?.id).subscribe(data => {
      this.usuarioRegistrado = [data]
    })
  }


  // Función que nos trae a los usuarios amigos del usuario registrado
  obtenerAmigos() {
    this._amigosService.obtenerAmigos().subscribe(amigos => {
      this.amigos = amigos

    })
  }

  // Función que nos trae a los usuarios que no son amigos del usuario registrado
  obtenerNoAmigos(nombreAmigo: string) {
    this._amigosService.noAmigos(nombreAmigo).subscribe(noAmigos => {
      this.noAmigos = noAmigos

      
      // Marca como pendiente a los usuarios que no sean nuestros amigos, pero que tengan una solicitud de amistad nuestra
      this.obtenerNotificacionPendienteDestino(this.noAmigos)

      // Marca como pendiente a aquellos usuarios que nos hayan enviado solicitudes de amistad 
      this.obtenerNotificacionPendienteOrigen(this.noAmigos)
    })
  }


  /**
   * Encuentra los usuarios que tienen notificaciones nuestras
   * @param usuarios Usuarios no amigos del usuario registrado
   */
  obtenerNotificacionPendienteDestino(usuarios: any) {

    // Busca por cada usuario alguna relación en la tabla NotificacionesAmistad con el usuario registrado
    for (let usuario of usuarios) {
      this._notificacionesService.obtenerNotificacionesUsuarioOrigenDestino(this.credencialesUsuario?.id, usuario.id).subscribe(data => {
        this.notificaciones = data.results

        // Si encuentra un usuario con notificacion, lo pondrá en pendiente de amistad
        if (this.notificaciones?.length != 0  ) {
          usuario.amistadPendiente = true
        }
      })
    }
  }


  /**
   * Encuentra los usuarios que nos han enviado notificaciones
   * @param usuarios 
   */
  obtenerNotificacionPendienteOrigen(usuarios: any) {

    // Busca por cada usuario alguna relación en la tabla NotificacionesAmistad con el usuario registrado
    for (let usuario of usuarios) {
      this._notificacionesService.obtenerNotificacionesUsuarioOrigenDestino(usuario.id, this.credencialesUsuario?.id ).subscribe(data => {
        this.notificaciones = data.results

        // Si encuentra un usuario con notificacion, lo pondrá en pendiente de amistad
        if (this.notificaciones?.length != 0   ) {
          usuario.amistadPendiente = true

        }

      })
    }
  }


  // -------- AÑADIR NOTIFICACION --------

  agregarAmigo(amigoUrl: string) {

    let notificacion = new Notificacion(null, this.usuarioRegistrado[0]?.url, amigoUrl, "Pendiente", this.fecha, false, null)

    this._notificacionesService.nuevaNotificacion(notificacion).subscribe(notificacion => {
   
      if (notificacion.status == 201) {
        this.ngOnInit();
      }
    });
  }

  // -------- ELIMINAR AMISTAD --------

  /**
   * Función encargada de cancelar la amistad 
   * 1. Primero creará una entrada en la tabla AmistadesCanceladas para llevar constancia de dicha amistad
   * 2. Luego elimina ambas coincidencias de la relación en la tabla Amigos
   * @param amigoId Id del amigo con el que queremos cancelar amistad
   */
  eliminarAmistad(amigoId: string) {



    // Obtiene la amistad de la base de datos perteneciente al amigo del usuario registrado
    this._amigosService.obtenerAmistad(amigoId, this.credencialesUsuario?.id).subscribe(data => {
      this.idAmistad = data.results

      // Eliminamos la amistad de la base de datos
      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe(data => {
        if (data.status == 204) {

          // Obtiene la amistad de la base de datos perteneciente al usuario registrado
          this._amigosService.obtenerAmistad(this.credencialesUsuario?.id, amigoId).subscribe(data => {
            this.idAmistad = data.results

            // Creamos un objeto AmistadesCanceladas  
            let amistadCancelada = new AmistadesCanceladas(this.usuarioRegistrado[0]?.url, this.idAmistad[0].usuario_receptor, this.idAmistad[0].fecha_creacion, this.fecha)

            // Añadimos una nueva fila a la tabla AmistadesCanceladas con los datos de la amistad 
            this._amigosService.nuevaCancelacion(amistadCancelada).subscribe()

            // Eliminamos la amistad de la base de datos
            this._amigosService.eliminarAmigo(this.idAmistad[0]?.url).subscribe(eliminacion => {

              if (eliminacion.status == 204) {
                this.ngOnInit();
        
              }
            })

          })

        }
      })
    })
  }
}


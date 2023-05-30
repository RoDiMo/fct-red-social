import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { AmigosService } from '../amigos.service';
import { Amigo } from './amigo';
import { AmistadesCanceladas } from '../amistades-canceladas/amistades-canceladas';
import { Notificacion } from '../notificaciones/notificaciones';
import { NotificacionesService } from '../notificaciones.service';

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

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
    public _notificacionesService: NotificacionesService,
  ) { }


  ngOnInit() {

    this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
    this.obtenerUsuarioRegistrado()

    this.obtenerAmigos()
    this.obtenerNoAmigos()


  }

  // Función donde Obtenemos los datos del usuario logueado
  obtenerUsuarioRegistrado() {

    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
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
  obtenerNoAmigos() {
    this._amigosService.noAmigos().subscribe(noAmigos => {
      this.noAmigos = noAmigos
      console.log(this.noAmigos)
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
      this._notificacionesService.obtenerNotificacionesUsuarioOrigenDestino(this.credencialesUsuario.id, usuario.id).subscribe(data => {
        this.notificaciones = data.results

        // Si encuentra un usuario con notificacion, lo pondrá en pendiente de amistad
        if (this.notificaciones.length != 0  ) {
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
      this._notificacionesService.obtenerNotificacionesUsuarioOrigenDestino(usuario.id, this.credencialesUsuario.id ).subscribe(data => {
        this.notificaciones = data.results

        // Si encuentra un usuario con notificacion, lo pondrá en pendiente de amistad
        if (this.notificaciones.length != 0   ) {
          usuario.amistadPendiente = true
          console.log(usuario.amistadPendiente)
        }

      })
    }
  }


  // -------- AÑADIR NOTIFICACION --------

  agregarAmigo(amigoUrl: string) {

    let notificacion = new Notificacion(null, this.usuarioRegistrado[0].url, amigoUrl, "Pendiente", this.fecha, false, null)

    this._notificacionesService.nuevaNotificacion(notificacion).subscribe(notificacion => {
      console.log(notificacion.status)
      if (notificacion.status == 201) {
        window.location.reload();
      }
      /*setTimeout(() => {
        window.location.reload();
      }, 500)*/
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
    this._amigosService.obtenerAmistad(amigoId, this.credencialesUsuario.id).subscribe(data => {
      this.idAmistad = data.results

      // Eliminamos la amistad de la base de datos
      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe(data => {
        if (data.status == 204) {

          // Obtiene la amistad de la base de datos perteneciente al usuario registrado
          this._amigosService.obtenerAmistad(this.credencialesUsuario.id, amigoId).subscribe(data => {
            this.idAmistad = data.results

            // Creamos un objeto AmistadesCanceladas  
            let amistadCancelada = new AmistadesCanceladas(this.usuarioRegistrado[0].url, this.idAmistad[0].usuario_receptor, this.idAmistad[0].fecha_creacion, this.fecha)

            // Añadimos una nueva fila a la tabla AmistadesCanceladas con los datos de la amistad 
            this._amigosService.nuevaCancelacion(amistadCancelada).subscribe()

            // Eliminamos la amistad de la base de datos
            this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe(eliminacion => {

              if (eliminacion.status == 204) {
                window.location.reload();
              }
            })

            /*
            setTimeout(() => {
              window.location.reload();
            }, 500)
            */
          })

        }
      })
    })
  }
}









// -------- GESTION DE USUARIOS --------

/**
 * Obtenemos todos los usuarios de la aplicacion
 
obtenerusuariosAll() {
  this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
    this.usuarios = data.results

    this.usuarios = this.usuarios.filter(usuario => usuario.id !== this.credencialesUsuario.id);
    

    // Marca como pendiente a los usuarios que no sean nuestros amigos, pero que tengan una solicitud de amistad nuestra
    this.obtenerNotificacionPendiente(this.usuarios)
  })
}

 

// -------- GESTION DE AMISTADES --------


 
obtenerAmistades() {

  // Obtenemos las coincidencias del usuario registrado en la tabla Amigos
  this._amigosService.obtenerAmistades(this.usuarioRegistrado[0].id).subscribe(data => {
    this.usuariosAmigos = data.results

    // Si el usuario aún no tiene ninguna amistad se obtienen los datos de todos los usuarios del sistema
    if (this.usuariosAmigos.length == 0) {
      this.obtenerusuariosAll()
    }

    // Obtenemos los datos de los usuarios que figuren como amigos del usuario registrado
    this.aniadirUsuario(this.usuariosAmigos, this.amigos)

  })
}


 
obtenerSolicitudes(amigos: any) {
  // Obtenemos todos los usuarios 
  this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
    this.usuarios = data.results

    // Recogemos los valores de los usuarios amigos
    this.recomendaciones.push(amigos)

    // Nos quedamos solo con los usuarios que no sean ni amigos ni el usuario registrado
    this.usuarios = this.usuarios.filter(usuario => !this.recomendaciones.some((amigo: { id: string; }) => usuario.id === amigo.id));
    this.usuarios = this.usuarios.filter(usuario => !this.recomendaciones.some((amigo: { id: string; }) => usuario.id === this.credencialesUsuario.id));


    // Marca como pendiente a los usuarios que no sean nuestros amigos, pero que tengan una solicitud de amistad nuestra
    this.obtenerNotificacionPendiente(this.usuarios)

  })

}



aniadirUsuario(amistades: any, amigos: any) {

  // Obtenemos los datos de usuarios de los amigos
  for (let amigo of amistades) {
    this._obtenerUsuarioService.getUsuarioUrl(amigo.usuario_receptor).subscribe(data => {
      amigos.push(data)

      // Obtenemos los usuarios que no son amigos
      this.obtenerSolicitudes(data)
    })
  }
}
*/
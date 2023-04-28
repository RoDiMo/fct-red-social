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
    this.gestionarUsuarios()


  }

  // -------- GESTION DE USUARIOS --------

  /**
   * Obtenemos todos los usuarios de la aplicacion
   */
  obtenerusuariosAll() {
    this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
      this.usuarios = data.results

      this.usuarios = this.usuarios.filter(usuario => usuario.id !== this.credencialesUsuario.id);
      console.log(this.usuarios)

      // Marca como pendiente a los usuarios que no sean nuestros amigos, pero que tengan una solicitud de amistad nuestra
      this.obtenerNotificacionPendiente(this.usuarios)
    })
  }

  /**
   * Encuentra los usuarios que tienen notificaciones nuestras
   * @param usuarios Usuario registrado
   */
  obtenerNotificacionPendiente(usuarios: any){

    // Busca por cada usuario alguna relación en la tabla NotificacionesAmistad con el usuario registrado
    for (let usuario of usuarios){
      this._notificacionesService.obtenerNotificacionesUsuarioOrigenDestino( this.credencialesUsuario.id, usuario.id).subscribe( data => {
        this.notificaciones = data.results
        console.log(this.notificaciones)

        // Si encuentra un usuario con notificacion, lo pondrá en pendiente de amistad
        if(this.notificaciones.length != 0){
          usuario.amistadPendiente = true
        }

      })
     }
  }

  /**
   * Función que gestiona todo el proceso de gestión de amistades
   */
  gestionarUsuarios() {

    //Obtenemos los datos del usuario logueado
    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.usuarioRegistrado = [data]

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


  /**
   * Función que buscar los usuarios que no son amigos del Usuario registrado
   * @param amigos Usuarios amigos del Usuario registrado
   */
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

        // Obtenemos los usuarios que no son amigos
        this.obtenerSolicitudes(data)
      })
    }
  }



  // -------- AÑADIR NOTIFICACION --------

  agregarAmigo(amigoUrl: string) {

    let notificacion = new Notificacion(null,this.usuarioRegistrado[0].url, amigoUrl,"Pendiente", this.fecha, false, null)

    this._notificacionesService.nuevaNotificacion(notificacion).subscribe();

    setTimeout(() => {
      window.location.reload();
    }, 50)

  }


  // -------- ELIMINAR AMISTAD --------

  /**
   * Función encargada de cancelar la amistad 
   * 1. Primero creará una entrada en la tabla AmistadesCanceladas para llevar constancia de dicha amistad
   * 2. Luego elimina ambas coincidencias de la relación en la tabla Amigos
   * @param amigoId Id del amigo con el que queremos cancelar amistad
   */
  eliminarAmistad(amigoId: string) {

    // Obtiene la amistad de la base de datos perteneciente al usuario registrado
    this._amigosService.obtenerAmistad(this.credencialesUsuario.id, amigoId).subscribe(data => {
      this.idAmistad = data.results

      // Creamos un objeto AmistadesCanceladas  
      let amistadCancelada = new AmistadesCanceladas(this.usuarioRegistrado[0].url, this.idAmistad[0].usuario_receptor, this.idAmistad[0].fecha_creacion, this.fecha)
      
      // Añadimos una nueva fila a la tabla AmistadesCanceladas con los datos de la amistad 
      this._amigosService.nuevaCancelacion(amistadCancelada).subscribe()

      // Eliminamos la amistad de la base de datos
      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe()

      setTimeout(() => {
        window.location.reload();
      }, 50)
    })

    // Obtiene la amistad de la base de datos perteneciente al amigo del usuario registrado
    this._amigosService.obtenerAmistad(amigoId, this.credencialesUsuario.id).subscribe(data => {
      this.idAmistad = data.results

       // Eliminamos la amistad de la base de datos
      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe()
    })
  }
}

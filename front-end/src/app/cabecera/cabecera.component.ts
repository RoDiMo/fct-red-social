import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AmigosService } from '../amigos.service';
import { Amigo, AmigosChat } from '../amigos/amigo';
import { Location } from '@angular/common';
import { NotificacionesService } from '../notificaciones.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactosChatModalComponent } from '../contactos-chat-modal/contactos-chat-modal.component';
import { ChatService } from '../chat.service';

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
  public usuariosAmigos: Array<AmigosChat> = []
  public mouseover!: boolean;
  public esAdmin: boolean = false;
  public numNotificaciones: string = ""; 
  public pagina = localStorage.getItem(`enlace-cabecera`);
  public altoVentana = window.innerHeight;

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _notificacionesService: NotificacionesService,
    public _amigosService: AmigosService,
    public _chatService: ChatService,
    public router: Router,
    public location: Location,
    public modal: NgbModal,
  ) { }


  ngOnInit(): void {
    if(!this.credenciales){
      this.credenciales = {"token":"8f78c9b24891cc8041ec9d3e39b4ee07b045de7","id":0,"username":"pruebatest"}
    }
   
    this.obtenerUsuarioRegistrado()
    this.obtenerNumNotificaciones()
   

  }

  @HostListener('window:resize')
  onWindowResize() {
    this.altoVentana = window.innerHeight;
  }

  contactosChatModal(){
    const _modal =  this.modal.open(ContactosChatModalComponent)
    _modal.componentInstance.datosAmigos = this.usuariosAmigos
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
      this.obtenerAmistades()
      if (this.datosUsuario.is_staff || this.datosUsuario.es_moderador) {
        this.esAdmin = true
      }
    })
  }



  obtenerAmistades() {

    // Obtenemos las coincidencias del usuario registrado en la tabla Amigos
    this._amigosService.obtenerAmistades(this.datosUsuario?.id).subscribe(data => {
      this.usuariosAmigos = data.results
    
      for (let amigo of this.usuariosAmigos){
     
        this._chatService.obtenerMensajesNoLeidos(this.credenciales?.id, amigo.datos_usuario_receptor.id).subscribe(numMensajes =>{
         
          amigo.numMensajesNoLeidos = numMensajes.length
          if(this.location.path()==(`/chat/${amigo.datos_usuario_receptor.id}`)){
            amigo.numMensajesNoLeidos = '0'
          }
          
       
        })
      }

    })
  }


  // -------- ENLACES DE LA CABECERA --------

  enlaceInicio() {


    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'inicio');
    this.router.navigateByUrl(`/`);
 
  }

  enlaceNotificaciones() {

    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'notificaciones');
    this.router.navigateByUrl(`/notificaciones`);

  }

  enlacePerfil() {

    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-personal');
    this.router.navigateByUrl(`/perfil-personal`);

  }

  enlaceAmigos() {

    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'amigos');
    this.router.navigateByUrl(`/amigos`);

  }

  enlacePublicaciones() {
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-usuario-publicaciones');
    this.router.navigateByUrl(`/perfil-usuario-publicaciones/${this.credenciales.id}`);;
  }

  enlaceAdministracion() {
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'inicio');
    this.router.navigateByUrl(`/admin-posts`);
  }

  enlaceFormularioPost() {

    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'formulario-post');
    this.router.navigateByUrl(`/formulario-post`);
 
  }

  // Removemos los datos usuario del LocalStorage y lo redirigimos a la página de login
  logout() {
    localStorage.removeItem("userData");
    localStorage.removeItem(`enlace-cabecera`)
    this.router.navigateByUrl(`/login`);
  }

}

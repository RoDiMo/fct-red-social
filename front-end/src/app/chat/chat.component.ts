import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent {


  public mensajes: Array<any> = [];
  public mensajesNoLeidos: Array<any> = []
  public credenciales = this._obtenerUsuarioService.obtenerCredenciales();
  public idAmigo = this.activatedRoute.snapshot.paramMap.get('id');
  public usuario_logeado!: PerfilUsuario;
  public usuario_amigo!: PerfilUsuario;
  public formularioChat!: FormGroup;
  public caracRestantes: number = 250;
  public quedanCaracteres: boolean = true;
  public caracSobrantes?: number


  constructor(
    public _chatService: ChatService,
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _perfilUsuarioService: PerfilUsuarioService,
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
  ) {

    this.formularioChat = this.formBuilder.group({
      emisor: ['' as string | null, Validators.required],
      receptor: ['' as string | null, Validators.required],
      mensaje: ['' as string, Validators.required],
    })

  }

  ngOnInit(): void {
    if(!this.credenciales){
      this.credenciales = {"token":"8f78c9b24891cc8041ec9d3e39b4ee07b045de7","id":0,"username":"pruebatest"}
    }
    this.obtenerParUsuarios()

    // Comprueba cada segundo que no haya nuevos mensajes

    setInterval(() => {
      this.obtenerMensajesNoLeidos()
      this.obtenerMensajes()
    }, 1000);


    this.formularioChat.valueChanges.subscribe(data => {
      this.controlarCaracteres(data.mensaje)
      console.log(data.mensaje)
    })

  }

  // Obtiene los datos de los usuarios que conforman el chat
  obtenerParUsuarios() {

    this._perfilUsuarioService.getPerfilUsuario(this.credenciales.id).subscribe(data => {
      this.usuario_logeado = data

      this._perfilUsuarioService.getPerfilUsuario(this.idAmigo).subscribe(data => {
        this.usuario_amigo = data
      })
    })
  }

  // Obtiene los mensajes de los usuarios que conforman el chat
  obtenerMensajes() {
    this._chatService.obtenerMensajesChat(this.credenciales.id, this.idAmigo).subscribe(data => {
      this.mensajes = data


    })
  }

  // Obtiene los mensajes "no leidos"y los actualiza a "leídos"
  obtenerMensajesNoLeidos() {
    this._chatService.obtenerMensajesNoLeidos(this.credenciales.id, this.idAmigo).subscribe(data => {
      this.mensajesNoLeidos = data

      this.actualizarVisto(this.mensajesNoLeidos)
    })
  }

  // Actualoiza los mensajes no leidos a leidos
  actualizarVisto(mensajes: any) {
    for (let i = 0; i < mensajes.length; i++) {
      const mensaje = mensajes[i]

      mensaje.leido = true;
      this._chatService.actualizarMensaje(mensaje.id, mensaje).subscribe()
    }
  }


  // Crea un nuevo mensaje
  nuevoMensaje() {
    this.formularioChat.patchValue({
      emisor: this.usuario_logeado?.url,
      receptor: this.usuario_amigo?.url,
      mensaje: this.formularioChat.get('mensaje')?.value
    })

    this._chatService?.nuevoMensaje(this.formularioChat?.value).subscribe(mensaje =>{
      if (mensaje.status == 201) {
        this.ngOnInit()
        this.formularioChat.reset();
      }
    })

    // Reinicia los valores del formulario
    /*
    setTimeout(() => {
      this.ngOnInit()
      this.formularioChat.reset();
    }, 200);
    */
  }


    // Funcion para controlar que el número de caracteres no sobrepase la capacidad permitida
    controlarCaracteres(contenido: string) {
      this.caracRestantes = 250 - contenido.length
  
      if (this.caracRestantes > 0) {
        this.quedanCaracteres = true
      } else {
        this.quedanCaracteres = false
        this.caracSobrantes = - (250 - contenido.length)
        this.caracRestantes = 0
      }
  
    }


}

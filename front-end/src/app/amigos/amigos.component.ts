import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { AmigosService } from '../amigos.service';
import { Amigo } from './amigo';
import { AmistadesCanceladas } from '../amistades-canceladas/amistades-canceladas';

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
  public usuariosAmigos: Array<Amigo> = [];
  public usuarioRegistrado: any = {};
  public credencialesUsuario: any;
  public idAmistad: any = {};
  public fecha = new Date();

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
  ) { }


  ngOnInit() {

    //this.obtenerUsuarios()

    this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
    this.gestionarUsuarios()
    console.log(this.credencialesUsuario)

  }

  obtenerusuariosAll(){
    this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
      this.usuarios = data.results
    
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== this.credencialesUsuario.id);
      console.log(this.usuarios)
    })
  }



  gestionarUsuarios() {

    //Obtenemos los datos del usuario logueado
    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.usuarioRegistrado = [data]
      this.obtenerAmistades()
    })
  }

  obtenerAmistades() {
    this._amigosService.obtenerAmistades(this.usuarioRegistrado[0].id).subscribe(data => {
      this.usuariosAmigos = data.results
      if(this.usuariosAmigos.length == 0){
        this.obtenerusuariosAll()
      }
      this.aniadirUsuario(this.usuariosAmigos, this.amigos)

    })
  }

  obtenerSolicitudes(amigos: any) {
    this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
      this.usuarios = data.results
      this.recomendaciones.push(amigos)     

      this.usuarios = this.usuarios.filter(usuario => !this.recomendaciones.some((amigo: { id: string; }) => usuario.id === amigo.id));
      this.usuarios = this.usuarios.filter(usuario => !this.recomendaciones.some((amigo: { id: string; }) => usuario.id === this.credencialesUsuario.id));

    })

  }

  aniadirUsuario(usuario: any, amigos: any) {
 
    for (let amigo of usuario) {
      this._obtenerUsuarioService.getUsuarioUrl(amigo.usuario_receptor).subscribe(data => {
        console.log(amigos)
        amigos.push(data)
        this.obtenerSolicitudes(data)
      })
    }
  }





  agregarAmigo(amigoUrl: string) {

    let usuario_emisor = new Amigo(this.usuarioRegistrado[0].url, amigoUrl, this.fecha)
    let usuario_receptor = new Amigo(amigoUrl, this.usuarioRegistrado[0].url, this.fecha)

    this._amigosService.nuevaAmistad(usuario_emisor).subscribe()
    this._amigosService.nuevaAmistad(usuario_receptor).subscribe()


    setTimeout(() => {
      this.amigos = []
      this.ngOnInit()
    }, 50)
  }




  eliminarAmistad(amigoId: string) {

    this._amigosService.obtenerAmistad(this.credencialesUsuario.id, amigoId).subscribe(data => {
      this.idAmistad = data.results
      let amistadCancelada = new AmistadesCanceladas(this.usuarioRegistrado[0].url, this.idAmistad[0].usuario_receptor, this.idAmistad[0].fecha_creacion, this.fecha)

      this._amigosService.nuevaCancelacion(amistadCancelada).subscribe()
      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe()
    
      setTimeout(() => {
        
        window.location.reload();
      }, 50)
    })

    this._amigosService.obtenerAmistad(amigoId, this.credencialesUsuario.id).subscribe(data => {
      this.idAmistad = data.results

      this._amigosService.eliminarAmigo(this.idAmistad[0].url).subscribe()
      

     
    })

  }
}

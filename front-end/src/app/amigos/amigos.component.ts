import { Component } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { AmigosService } from '../amigos.service';
import { Amigo } from './amigo';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styles: [
  ]
})
export class AmigosComponent {
  public amigos: Array<PerfilUsuario> = [];
  public usuarioRegistrado: any = {};
  public credencialesUsuario: any;
  public idAmistad: any = {};

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    public _amigosService: AmigosService,
  ) {}


  ngOnInit(){

    this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
    this._obtenerUsuarioService.getUsuariosAll().subscribe(data => {
      this.amigos = data.results;
    })

    this.gestionarUsuarios()

    console.log(this.credencialesUsuario)
  }



  gestionarUsuarios() {
    //Obtenemos los datos del usuario logueado
    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.usuarioRegistrado = [data]
      //console.log(this.usuarioRegistrado)
    })
  }


  agregarAmigo(amigoUrl:string){
    let fecha = new Date();
    let usuario_emisor = new Amigo(this.usuarioRegistrado[0].url, amigoUrl, fecha)
    let usuario_receptor = new Amigo(amigoUrl, this.usuarioRegistrado[0].url, fecha)

    this._amigosService.nuevaAmistad(usuario_emisor).subscribe()
    this._amigosService.nuevaAmistad(usuario_receptor).subscribe()
  }


  eliminarAmigo(urlAmistad: string){
    this._amigosService.eliminarAmigo(urlAmistad).subscribe()

  }


  obtenerAmistad(amigoId: string){

    this._amigosService.obtenerAmistad(this.credencialesUsuario.id, amigoId).subscribe(data => {
      this.idAmistad = data.results
      this.eliminarAmigo(this.idAmistad[0].url)
    })

    this._amigosService.obtenerAmistad(amigoId, this.credencialesUsuario.id).subscribe(data => {
      this.idAmistad = data.results
      this.eliminarAmigo(this.idAmistad[0].url)
    })

  }
}

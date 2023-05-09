import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { AmigosService } from '../amigos.service';
import { Amigo } from '../amigos/amigo';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styles: [
  ]
})
export class CabeceraComponent {

  public datosUsuario!: PerfilUsuario;
  public credenciales = this._obtenerUsuarioService.obtenerCredenciales();
  public tablaAmigos! : Array<Amigo>;
  public usuariosAmigos: Array<PerfilUsuario> = []
  public mouseover!:boolean;

  constructor(
     public _obtenerUsuarioService: AutenticacionUsuariosService,
      private _perfilUsuarioService: PerfilUsuarioService,
      private _amistadesService: AmigosService,
      private activatedRoute: ActivatedRoute,
      private router: Router
     ) { }


     ngOnInit(): void {
      this.obtenerAmistades()
    }

     obtenerAmistades(){
      this._amistadesService.obtenerAmistades(this.credenciales.id).subscribe(data => {
        this.tablaAmigos = data.results

        for(let amigo of this.tablaAmigos){
          
          this.obtenerUsuariosAmigos(amigo)
        }

      })      
     }

     obtenerUsuariosAmigos(amigo: Amigo){
      //console.log(amigo.usuario_receptor)
       this._perfilUsuarioService.getUsuario(amigo.usuario_receptor).subscribe(data => {


        this.usuariosAmigos.push(data);

      })
     }


     logout() {
      localStorage.removeItem("userData");
      this.router.navigateByUrl(`/login`);
  }

}

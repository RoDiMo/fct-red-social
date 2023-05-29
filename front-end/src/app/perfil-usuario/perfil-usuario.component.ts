import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from './perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styles: [
  ]
})
export class PerfilUsuarioComponent implements OnInit{
  public datosUsuario!: PerfilUsuario;
  public id = this._obtenerUsuarioService.obtenerCredenciales().id

  constructor(
     public _obtenerUsuarioService: AutenticacionUsuariosService,
      private _perfilUsuarioService: PerfilUsuarioService,
      private activatedRoute: ActivatedRoute,
      private router: Router
     ) { }

  ngOnInit(): void {
    // Obtiene los datos del usuario registrado en la sesion
    this._perfilUsuarioService.getPerfilUsuario(this.id).subscribe(data => {
          this.datosUsuario = data;
      
        });
  }



  // Borra los datos del usuario del LocaleStorage, cerrando la sesion
  logout() {
    localStorage.removeItem("userData");
    this.router.navigateByUrl(`/login`);
}
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';

@Component({
  selector: 'app-perfil-otro-usuario',
  templateUrl: './perfil-otro-usuario.component.html',
  styles: [
  ]
})
export class PerfilOtroUsuarioComponent {

  public datosUsuario!: PerfilUsuario;
  public id = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    private _perfilUsuarioService: PerfilUsuarioService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
 
    // Obtiene los datos del usuario registrado en la sesion
    this._perfilUsuarioService.getPerfilUsuario(this.id).subscribe(data => {
      this.datosUsuario = data;

    });
  }
}

import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from './perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styles: [
  ]
})
export class PerfilUsuarioComponent implements OnInit{
  public datosUsuario: PerfilUsuario | null = null;

  constructor(private perfilUsuarioService: PerfilUsuarioService,
     private activatedRoute: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    // Id del usuario que ha iniciado sesion
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    // Obtiene los datos del usuario registrado en la sesion
    this.perfilUsuarioService.getPerfilUsuario(id).subscribe({
        next: (data) => {
          this.datosUsuario = data;
          console.log(this.datosUsuario);

        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }

  // Borra los datos del usuario del LocaleStorage, cerrando la sesion
  logout() {
    localStorage.removeItem("userData");
    this.router.navigateByUrl(`/login`);
}
}

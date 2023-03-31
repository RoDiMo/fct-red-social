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
    const id = this.activatedRoute.snapshot.paramMap.get('id');
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


  logout() {
    localStorage.removeItem("userData");
    this.router.navigateByUrl(`/login`);
}
}

import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from './perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styles: [
  ]
})
export class PerfilUsuarioComponent implements OnInit {
  public datosUsuario!: PerfilUsuario;
  public credenciales = this._obtenerUsuarioService?.obtenerCredenciales();
  public contenidoCargado: boolean = false;
  public formularioImagenUsuario!: FormGroup;

  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    private _perfilUsuarioService: PerfilUsuarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public fFormBuilder: FormBuilder,
    private location: Location,
  ) { 

    this.formularioImagenUsuario = this.fFormBuilder.group({
  
      email: ['' as string | null, Validators.required],
      first_name: ['' as string | null, Validators.required],
      last_name: ['' as string | null, Validators.required],
      telefono: ['' as string | null, Validators.required],
      pais: ['' as string | null, Validators.required],
      estado: ['' as string | null, Validators.required],
      ciudad: ['' as string | null, Validators.required],
      direccion: ['' as string | null, Validators.required],
      foto_perfil: null,
    })

  }

  ngOnInit(): void {
    // Obtiene los datos del usuario registrado en la sesion
    this._perfilUsuarioService.getPerfilUsuario(this.credenciales?.id).subscribe(data => {
      this.datosUsuario = data;

      this.formularioImagenUsuario.patchValue({
     
        email: this.datosUsuario.email!,
        first_name: this.datosUsuario.first_name!,
        last_name: this.datosUsuario.last_name!,
        telefono: this.datosUsuario.telefono!,
        pais: this.datosUsuario.pais!,
        estado: this.datosUsuario.estado!,
        ciudad: this.datosUsuario.ciudad!,
        direccion: this.datosUsuario.direccion!,
      })
      //console.log(this.formularioImagenUsuario.value)
    });
    

    setTimeout(() => {
      this.contenidoCargado = true;

    }, 500);
  }


  
  enlaceAmigos() {

    this.location.replaceState(`/amigos`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'amigos');
    location.reload();
  }

    // Función para manejar la selección de una imagen por parte del usuario
    onFileSelected(event: any) {
      const formData: any = new FormData();
      const file = event.target.files[0];
  
      if (file != null) {
        formData.append('email', this.formularioImagenUsuario.get('email')?.value);
        formData.append('first_name', this.formularioImagenUsuario.get('first_name')?.value);
        formData.append('last_name', this.formularioImagenUsuario.get('last_name')?.value);
        formData.append('telefono', this.formularioImagenUsuario.get('telefono')?.value);
        formData.append('pais', this.formularioImagenUsuario.get('pais')?.value);
        formData.append('estado', this.formularioImagenUsuario.get('estado')?.value);
        formData.append('ciudad', this.formularioImagenUsuario.get('ciudad')?.value);
        formData.append('direccion', this.formularioImagenUsuario.get('direccion')?.value);
        formData.append('foto_perfil', file);

  
        
        this._perfilUsuarioService.editarDatosPerfil(this.datosUsuario.id, formData).subscribe(data => {
  
          if (data.status == 200) {
            this.ngOnInit();
          }
          /*
          setTimeout(() => {
            this.obtenerPost();
            this.gestionarUsuarios();
          }, 5)
          */
        })
          
      }
    }



  // Borra los datos del usuario del LocaleStorage, cerrando la sesion
  logout() {
    localStorage.removeItem("userData");
    this.router.navigateByUrl(`/login`);
  }
}

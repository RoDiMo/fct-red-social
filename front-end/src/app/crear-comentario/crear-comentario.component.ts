import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Post } from '../post/post';
import { FormBuilder, Validators } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ComentariosService } from '../comentarios.service';

@Component({
  selector: 'app-crear-comentario',
  templateUrl: './crear-comentario.component.html',
  styles: [
  ]
})
export class CrearComentarioComponent implements OnInit{

  private credenciales!: PerfilUsuario;
  private usuario!: PerfilUsuario;
  private post!: Post;
  formularioComent;


  constructor(
                private obtenerUsuario: PerfilUsuarioService, 
                private obtenerCredenciales: AutenticacionUsuariosService,
                private formBuilder: FormBuilder,
                private publicarComentario: ComentariosService,
            ){
                this.formularioComent = this.formBuilder.group({
                  contenido: ['' as string | null, Validators.required],
                  post: ['' as string],
                  usuario: ['' as string],
                })

            }


  ngOnInit(): void {
    this.credenciales = this.obtenerCredenciales.obtenerCredenciales();
    

    // Obtengo al usuario que coincide con las credenciales
    this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe({
      next: (data: PerfilUsuario) =>{
        this.usuario = data
        console.log(this.usuario.id)


        this.formularioComent.setValue({
          contenido: '' as any,
          post: `http://localhost:8000/posts/2/`,
          usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,

        });

      }
      });

  }

  nuevoComentario(){
    this.publicarComentario.nuevoComentario(this.formularioComent.value).subscribe(data =>{});
  }
}

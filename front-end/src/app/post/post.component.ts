import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from './post';
import { Comentario } from '../comentario/comentario';
import { ComentariosService } from '../comentarios.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: [
  ]
})
export class PostComponent implements OnInit{
  public posts: Array<Post> = [];
  public comentarios: Array<Comentario> = [];
  public usuarios: any;
  public credenciales!: PerfilUsuario;
  public usuario!: PerfilUsuario;
  formularioComent;

  constructor(private _postService: PostService,
              public obtenerUsuario: PerfilUsuarioService, 
              public obtenerCredenciales: AutenticacionUsuariosService,
              private _comentarioService: ComentariosService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public formBuilder: FormBuilder,
              ){ 
                this.formularioComent = this.formBuilder.group({
                  contenido: ['' as string | null, Validators.required],
                  post: ['' as string],
                  usuario: ['' as string],
              })
            }

    
  ngOnInit(): void {
    
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    // Obtiene el post
    this._postService.obtenerPost(id).subscribe({
      next: (data) => {
        this.posts = [data];
        console.log(this.posts)

      },
      error: (error) => {
        console.log(error);
      }
    })

     // Obtiene los comentaris del post
    this._comentarioService.obtenerComentariosPost(id).subscribe({
      next: (data)=>{
        this.comentarios = data.results
        console.log(this.comentarios)

        // Obtenemos los usuarios de cada comentario
        for(let comentario of this.comentarios){
          this.obtenerUsuario.getUsuario(comentario.usuario).subscribe({
            next: (data)=>{
              this.usuarios = data
              
              // Obtenemos el nombre de cada usuario
              comentario.nombre_usuario =  this.usuarios.username
            }
          })
          
         
        }
      }
    })


    //Obtener credenciales de usuario
    this.credenciales = this.obtenerCredenciales.obtenerCredenciales();
    
    if (this.credenciales && this.credenciales.id) {
    // Obtengo al usuario que coincide con las credenciales
    this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe({
      next: (data: PerfilUsuario) =>{
        this.usuario = data
      
        // Añado los valores a los campos del formulario
        this.formularioComent.setValue({
          contenido: '' as any,
          post: `http://localhost:8000/posts/${id}/`,
          usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,

        });

      }
      });
    }
     
  }


  nuevoComentario(){
    this._comentarioService.nuevoComentario(this.formularioComent.value).subscribe();

    // Refresca la pagina
    window.location.reload();
  }
}

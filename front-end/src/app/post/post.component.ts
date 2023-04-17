import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from './post';
import { Comentario } from '../comentario/comentario';
import { ComentariosService } from '../comentarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: [
  ]
})
export class PostComponent implements OnInit {
  public posts: Array<Post> = [];
  public comentarios: Array<Comentario> = [];
  public usuarios: any;
  public credenciales!: PerfilUsuario;
  public usuario!: PerfilUsuario;
  formularioComent;
  formularioImagenPost!: FormGroup;
  public id:string|null = ""; 

  constructor(private _postService: PostService,
    public obtenerUsuario: PerfilUsuarioService,
    public obtenerCredenciales: AutenticacionUsuariosService,
    private _comentarioService: ComentariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public commentPormBuilder: FormBuilder,
    public postFormBuilder: FormBuilder,
  ) {
    this.formularioComent = this.commentPormBuilder.group({
      contenido: ['' as string | null, Validators.required],
      post: ['' as string],
      usuario: ['' as string],
    })

    this.formularioImagenPost = this.postFormBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      imagen: null,
    })
  }


  ngOnInit(): void {

    // Id del Post
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // Obtiene el post
    this._postService.obtenerPost(this.id).subscribe({
      next: (data) => {
        this.posts = [data];
        //console.log(this.posts)

        this.formularioImagenPost.setValue({
          titulo: this.posts[0].titulo,
          contenido: this.posts[0].contenido,
          usuario: this.posts[0].usuario,
          imagen: null,
        });

        //console.log(this.posts[0])


      },
      error: (error) => {
        console.log(error);
      }
    })

    // Obtiene los comentarios del post
    this.mostrarComentarios(this.id)


    //Obtener credenciales de usuario
    this.credenciales = this.obtenerCredenciales.obtenerCredenciales();

    if (this.credenciales && this.credenciales.id) {
      // Obtengo al usuario que coincide con las credenciales
      this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe({
        next: (data: PerfilUsuario) => {
          this.usuario = data

          // Añado los valores a los campos del formulario
          this.formularioComent.setValue({
            contenido: '' as any,
            post: `http://localhost:8000/posts/${this.id}/`,
            usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,

          });
        }
      });
    }
  }

  // Función para manejar la selección de una imagen por parte del usuario
  onFileSelected(event: any) {
    const formData: any = new FormData();
    const file = event.target.files[0];

    if (file != null) {
      formData.append('titulo', this.formularioImagenPost.get('titulo')?.value);
      formData.append('contenido', this.formularioImagenPost.get('contenido')?.value);
      formData.append('usuario', this.formularioImagenPost.get('usuario')?.value);
      formData.append('imagen', file);

      this._postService.modificarPost(this.posts[0].id, formData).subscribe(data => {
        window.location.reload();
      })
    }
  }

  // Obtiene los comentarios del post
  mostrarComentarios(id: any) {
    this._comentarioService.obtenerComentariosPost(id).subscribe({
      next: (data) => {
        this.comentarios = data.results
        console.log(this.comentarios)

        // Obtenemos los usuarios de cada comentario
        for (let comentario of this.comentarios) {
          this.obtenerUsuario.getUsuario(comentario.usuario).subscribe({
            next: (data) => {
              this.usuarios = data

              // Obtenemos el nombre de cada usuario
              comentario.nombre_usuario = this.usuarios.username
            }
          })
        }
      }
    })
  }

  // Crea un nuevo comentario con los valores introducidos al fomrulario
  nuevoComentario() {

    this._comentarioService.nuevoComentario(this.formularioComent.value).subscribe();
    //const id = this.activatedRoute.snapshot.paramMap.get('id');
    setTimeout(()=>{
      this.mostrarComentarios(this.id)
    }, 200);
    
  }

  eliminarPost() {
    this._postService.eliminarPost(this.posts[0].id).subscribe();
    this.router.navigateByUrl('/');
  }

  modificarPost() {
    this.router.navigateByUrl(`modifica-post/${this.posts[0].id}`);
  }

  modificaComentario(id: string) {
    this.router.navigateByUrl(`modifica-comentario/${id}`);
  }

}

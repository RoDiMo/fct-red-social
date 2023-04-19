import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostLike } from './post';
import { Comentario } from '../comentario/comentario';
import { ComentariosService } from '../comentarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { GestionLikesService } from '../gestion-likes.service';
import { Likes } from '../home/home';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: [
  ]
})
export class PostComponent implements OnInit {
  public posts: Array<PostLike> = [];
  public postsLikes: Array<Post> = []
  public comentarios: Array<Comentario> = [];
  public usuarios: any;
  public credenciales!: PerfilUsuario;
  public usuario!: any;
  formularioComent;
  formularioImagenPost!: FormGroup;
  public formularioPost!: FormGroup;
  public formularioVisitas!: FormGroup;
  public id: string | null = "";
  public likeDado: boolean = false;

  constructor(private _postService: PostService,
    public obtenerUsuario: PerfilUsuarioService,
    public obtenerCredenciales: AutenticacionUsuariosService,
    private _comentarioService: ComentariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public commentPormBuilder: FormBuilder,
    public postFormBuilder: FormBuilder,
    public formBuilder: FormBuilder,
    public visitasFormBuilder: FormBuilder,
    public _gestionLikesService: GestionLikesService,
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

    this.formularioPost = this.formBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      num_likes: [0 as number],

    });

    this.formularioVisitas = this.visitasFormBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      num_visitas: [0 as number],

    });
  }


  ngOnInit(): void {

    // Id del Post
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // Obtiene el post
    this.obtenerPost()

    // Obtenemos los comentarios del post
    this.mostrarComentarios(this.id)

    // Obtener credenciales de usuario
    this.credenciales = this.obtenerCredenciales.obtenerCredenciales();

    // Obtenemos el usuario registrado además de comprobar si le ha dado like al post
    this.gestionarUsuarios();

    // Agregamos todas la id del Post al Local Storage
    this.agregarVisitas(this.id);

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
        setTimeout(() => {
          this.obtenerPost();
          this.gestionarUsuarios();
        }, 5)
      })
    }
  }



  // -------- GESTION DEL POST --------

  obtenerPost() {
    this._postService.obtenerPost(this.id).subscribe(data => {
      this.posts = [data];

      this.formularioImagenPost.setValue({
        titulo: this.posts[0].titulo,
        contenido: this.posts[0].contenido,
        usuario: this.posts[0].usuario,
        imagen: null,
      });

    })
  }


  eliminarPost() {
    this._postService.eliminarPost(this.posts[0].id).subscribe();
    this.router.navigateByUrl('/');
  }

  modificarPost() {
    this.router.navigateByUrl(`modifica-post/${this.posts[0].id}`);
  }



  // -------- GESTION DE USUARIOS --------


  gestionarUsuarios() {
    if (this.credenciales && this.credenciales.id) {
      // Obtengo al usuario que coincide con las credenciales
      this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe(data => {
        this.usuario = data

        // Añado los valores a los campos del formulario
        this.formularioComent.setValue({
          contenido: '' as any,
          post: `http://localhost:8000/posts/${this.id}/`,
          usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,

        });


        // -------- GESTION DE LIKES --------

        // Comprobamos si hay alguna coincidencia del post en la tabla like
        this._gestionLikesService.obtenerPosts(this.id).subscribe(data => {
          this.postsLikes = data.results;

          // Buscamos al usuario registrado en los post con likes
          let likeUsuario = this.postsLikes.find(post => post.usuario == this.usuario.url);

          // Si el post no tiene nignuna coincidencia en la tabla like significa que ningún usuario le ha dado like
          if (this.postsLikes.length == 0) {
            this.posts[0].likeDado = false;
          } else {

            if (likeUsuario != undefined) { // El usuario le ha dado like al post
              this.posts[0].likeDado = true;
            } else { // El usuario no le ha dado like al post
              this.posts[0].likeDado = false;
            }
          }
        });
      });
    }

  }


  // -------- GESTION DE COMENTARIOS --------

  // Obtiene los comentarios del post
  mostrarComentarios(id: any) {
    this._comentarioService.obtenerComentariosPost(id).subscribe({
      next: (data) => {
        this.comentarios = data.results


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
    setTimeout(() => {
      this.mostrarComentarios(this.id)
    }, 200);

  }


  modificaComentario(id: string) {
    this.router.navigateByUrl(`modifica-comentario/${id}`);
  }


  // -------- GESTION DE LIKES --------

  gestionLikes(idPost: any, urlPost: any) {

    // Obtenemos el numero de coincidencias de este Post en la tabla Likes
    this._gestionLikesService.obtenerPosts(idPost).subscribe(data => {
      this.postsLikes = data.results;


      // Comprobamos si el usuario lo ha dado like al post
      const likeUsuario = this.postsLikes.find(post => post.usuario == this.usuario.url);
      let num_likes = 0;
      // Si se al algun usuario significa que ya le ha dado like al Post 
      if (likeUsuario != undefined) {

        // Controlamos el numero de likes
        num_likes = this.postsLikes.length - 1

        // Si el usuario le ha dado like eliminaremos su coincidencia de la tabla Likes
        this._gestionLikesService.eliminarLike(likeUsuario.url).subscribe();

        // Si el usuario no le ha dado like, añadiremos una nueva coincidencia en la tabla Likes
      } else {

        // Controlamos el numero de likes
        num_likes = this.postsLikes.length + 1
        let like = new Likes(this.usuario.url, urlPost)
        this._gestionLikesService.guardarLike(like).subscribe();
      }


      this.actualizarNumLikes(num_likes, urlPost)
    });

  }

  // Actualiza el número de likes que tiene el post seleccionado
  actualizarNumLikes(num_likes: number, urlPost: string) {

    // Obtenemos los datos del post
    this._postService.obtenerPostUrl(urlPost).subscribe(data => {
      this.posts = [data]

      // Actualizamsos los datos del post
      this.formularioPost.setValue({
        titulo: this.posts[0].titulo,
        contenido: this.posts[0].contenido,
        usuario: this.posts[0].usuario,
        fecha_publicacion: this.posts[0].fecha_publicacion,
        num_likes: num_likes,
      });

      this._postService.modificarPost(this.posts[0].id, this.formularioPost.value).subscribe(data => {

        setTimeout(() => {
          this.obtenerPost();
          this.gestionarUsuarios();
        }, 5)

      })
    })
  }


  // -------- GESTION DE VISITAS --------

  /** 
   * 
   * Método para evitar que aumente el numero de visitas sobre un post
   * al actualizar la página varias veces.
   * 
   * Al acceder a un post, su id quedará almacenada en el Local Storage 
   * y su numero de visitas no aumentará mientras se encuentre almacenado.
   * 
   * Esta funcion almacena una id
   * 
   * @method agregarVisitas
   * @param id - Id del post
   */
  agregarVisitas(id: any) {

    const postAlmacenado = localStorage.getItem(`post-${this.id}-visit-updated`);

    if (!postAlmacenado) {
      this.actualizarNumVisitas(this.id);
    }
  }

  actualizarNumVisitas(id: any) {

    // Obtenemos los datos del post
    this._postService.obtenerPost(id).subscribe(data => {
      this.posts = [data]

      // Actualizamsos los datos del post
      this.formularioVisitas.setValue({
        titulo: this.posts[0].titulo,
        contenido: this.posts[0].contenido,
        usuario: this.posts[0].usuario,
        fecha_publicacion: this.posts[0].fecha_publicacion,
        num_visitas: this.posts[0].num_visitas + 1,
      });

      this._postService.modificarPost(this.posts[0].id, this.formularioVisitas.value).subscribe(data => {

        setTimeout(() => {
          this.obtenerPost();
          this.gestionarUsuarios();
        }, 5)

      })
    });

    localStorage.setItem(`post-${id}-visit-updated`, 'true');
  }
}

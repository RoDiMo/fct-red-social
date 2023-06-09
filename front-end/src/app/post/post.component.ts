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
import { GestionLikesService } from '../gestion-likes.service';
import { Likes } from '../home/home';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: [
  ]
})
export class PostComponent implements OnInit {
  public posts: Array<Post> = [];
  public post!: Post;
  public postsLikes: Array<Post> = []
  public comentarios: Array<Comentario> = [];
  public usuariosComentarios: any;
  public credenciales!: PerfilUsuario;
  public usuario!: any;
  formularioComent;
  formularioImagenPost!: FormGroup;
  public formularioPost!: FormGroup;
  public formularioVisitas!: FormGroup;
  public formularioNumCom!: FormGroup;
  public id: string | null = "";
  public likeDado: boolean = false;

  public caracRestantes: number= 1024;
  public caracSobrantes?: number
  public quedanCaracteres: boolean = true;
  public errors : Array<any> = [];

  public contenidoCargado: boolean = false;

  constructor(
    public _postService: PostService,
    public obtenerUsuario: PerfilUsuarioService,
    public obtenerCredenciales: AutenticacionUsuariosService,
    public _comentarioService: ComentariosService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
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

    this.formularioNumCom = this.visitasFormBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      num_comentarios: [0 as number],

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

    setTimeout(() => {
      this.contenidoCargado = true;
  
    }, 500)

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
   
        if (data.status == 200) {
          this.obtenerPost();
          this.gestionarUsuarios();
        }

        /*setTimeout(() => {
          this.obtenerPost();
          this.gestionarUsuarios();
        }, 5)*/
      })
    }
  }



  // -------- GESTION DEL POST --------

  obtenerPost() {
    this._postService.obtenerPost(this.id).subscribe(data => {
      this.posts = [data];
      this.obtenerUsuario.getUsuario(this.posts[0].usuario).subscribe(data => {
        this.posts[0].nombre_usuario = data.username;
        this.posts[0].foto_perfil = data.foto_perfil;

      })

      this.formularioImagenPost.setValue({
        titulo: this.posts[0].titulo,
        contenido: this.posts[0].contenido,
        usuario: this.posts[0].usuario,
        imagen: null,
      });

    })
  }


  esCreadorPost(campo:any): boolean{
    
      
      if(this.usuario != undefined){

        if(this.usuario.is_staff){
          return true
        }
        
        if(campo.nombre_usuario != this.credenciales.username){
          return false
        }
      }
    
      return true
  }


  eliminarPost() {
    this._postService.eliminarPost(this.posts[0].id).subscribe(data =>{
      this.router.navigateByUrl('/');
    });
   
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
     
        this.numComentarios(this.comentarios.length)


        // Obtenemos los usuarios de cada comentario
        for (let comentario of this.comentarios) {
          this.obtenerUsuario.getUsuario(comentario.usuario).subscribe({
            next: (data) => {
              this.usuariosComentarios = data
    
              // Obtenemos el nombre de cada usuario
              comentario.nombre_usuario = this.usuariosComentarios.username
              comentario.foto_perfil = this.usuariosComentarios.foto_perfil
        
            }
          })
        }
      }
    })
  }

  // Crea un nuevo comentario con los valores introducidos al fomrulario
  nuevoComentario() {

    this._comentarioService.nuevoComentario(this.formularioComent.value).subscribe(comentario => {

      if (comentario.status == 201) {
        this.ngOnInit()
        this.formularioComent.reset(); 
      }
    });

  }


  modificaComentario(id: string) {
    this.router.navigateByUrl(`modifica-comentario/${id}`);
  }

  eliminarComentario(id:string){
    this._comentarioService.eliminarComentario(id).subscribe(comentario => {

    
      if (comentario.status == 204) {
        this.ngOnInit()
      }
    });

  }

  //Obtenemos el numero de comentarios del post y lo añadimos a su respectivo campo en la base de datos
  numComentarios(numComentarios:number){
   
    this._postService.obtenerPost(this.id).subscribe(data => {
      this.post = data
      
      this.formularioNumCom.setValue({
        titulo: this.post.titulo,
        contenido: this.post.contenido,
        usuario: this.post.usuario,
        fecha_publicacion: this.post.fecha_publicacion,
        num_comentarios: numComentarios,
      });

      this._postService.modificarPost(this.post.id, this.formularioNumCom.value).subscribe()
     
    });
  }


  // -------- GESTION DE LIKES --------

  gestionLikes(idPost: any, urlPost: any) {

    // Obtenemos el numero de coincidencias de este Post en la tabla Likes
    this._gestionLikesService.obtenerPosts(idPost).subscribe(data => {
      this.postsLikes = data.results;


      // Comprobamos si el usuario lo ha dado like al post
      const likeUsuario = this.postsLikes.find(post => post.usuario == this.usuario?.url);
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
        let like = new Likes(this.usuario?.url, urlPost)
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

        if (data.status == 200) {
          this.obtenerPost();
          this.gestionarUsuarios();
        }
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

      // Modificamnos el post con el número de visitas y nos traemos los datos actualizados
      this._postService.modificarPost(this.posts[0].id, this.formularioVisitas.value).subscribe(data => {

        if (data.status == 200) {
          this.obtenerPost();
          this.gestionarUsuarios();
        }

      })
    });

    localStorage.setItem(`post-${id}-visit-updated`, 'true');
  }


  // Funcion para controlar que el número de caracteres no sobrepase la capacidad permitida
  controlarCaracteres(contenido: string){
    this.caracRestantes = 1024 - contenido.length

    if(this.caracRestantes > 0){
      this.quedanCaracteres = true
    }else{
      this.quedanCaracteres = false
      this.caracSobrantes = -(1024 - contenido.length)
      this.caracRestantes = 0
    }
   
  }

}

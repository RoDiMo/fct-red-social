import { Component } from '@angular/core';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { Likes, Usuarios } from './home';
import { Post } from '../post/post';
import { GestionLikesService } from '../gestion-likes.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PostService } from '../post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  public posts: Array<Post> = []
  public postsLikes: Array<Post> = []
  public credencialesUsuario: any;
  public usuarioRegistrado: any = {}
  public likeDado: boolean = false;
  public post: Array<Post> = [];
  public formularioPost!: FormGroup;


  constructor(
    private _paginaPrincipalService: PaginaPrincipalService,
    private _gestionLikesService: GestionLikesService,
    private _obtenerUsuarioService: AutenticacionUsuariosService,
    private _postService: PostService,
    public formBuilder: FormBuilder,
  ) {

  }

  // Codigo que se ejecuta al cargar la pagina
  ngOnInit() {


    // Obtiene los post  
    this._paginaPrincipalService.getPost().subscribe(data => {
      this.posts = data.results;

      // Obtenemos las credenciales del usuario logueado
      this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()

      // Obtenemos el usuario registrado además de comprobar si le ha dado like a los diferentes posts
      this.gestionarUsuarios();


    })

    this.formularioPost = this.formBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      num_likes: [0 as number],

    });
  }


  // -------- GESTION DE USUARIOS --------

  // Gestión de todo el código necesario para trabajar con los datos de los usuarios

  gestionarUsuarios() {
    //Obtenemos los datos del usuario logueado
    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.usuarioRegistrado = [data]

      // -------- GESTION DE LIKES --------
      // Comprobamos por cada post si hay alguna coincidencia en la tabla like
      for (let p of this.posts) {

        this.obtenerUsuarioPost(p)

        // Removemos todas las id los post registradas en el Local Storage
        this.removerVisitas(p.id)

        this.obtenerPostLikes(p)

      }
    })
  }


//Obtenemos el usuario que creó el post
  obtenerUsuarioPost(post:Post){
        
        this._obtenerUsuarioService.getUsuarioUrl(post.usuario).subscribe(data =>{
          post.nombre_usuario = data.username;
          post.foto_perfil = data.foto_perfil;

        })
  }


  // Obtenemos los posts con likes
  obtenerPostLikes(p:Post){
    this._gestionLikesService.obtenerPosts(p.id).subscribe(data => {
      this.postsLikes = data.results;

      // Buscamos al usuario registrado en los post con likes
      let likeUsuario = this.postsLikes.find(post => post.usuario == this.usuarioRegistrado[0].url);

      // Si el post no tiene nignuna coincidencia en la tabla like significa que ningún usuario le ha dado like
      if (this.postsLikes.length == 0) {
        p.likeDado = false;
      } else {

        if (likeUsuario != undefined) { // El usuario le ha dado like al post
          p.likeDado = true;
        } else { // El usuario no le ha dado like al post
          p.likeDado = false;
        }
      }
    });
  }


  // -------- GESTION DE VISITAS --------

  /**
   * Método para evitar que aumente el numero de visitas sobre un post
   * al actualizar la página varias veces.
   * 
   * Al acceder a un post, su id quedará almacenada en el Local Storage 
   * y su numero de visitas no aumentará mientras se encuentre almacenado.
   * 
   * Esta funcion borra todas las ids almacenadas
   * @param id - Id del post
   */ 
  removerVisitas(id: any) {
    let postAlmacenado = localStorage.getItem(`post-${id}-visit-updated`);
    if (postAlmacenado) {
      localStorage.removeItem(`post-${id}-visit-updated`);
    }
  }

  // -------- GESTION DE LIKES --------

  gestionLikes(idPost: any, urlPost: any) {

    // Obtenemos el numero de coincidencias de este Post en la tabla Likes
    this._gestionLikesService.obtenerPosts(idPost).subscribe(data => {
      this.postsLikes = data.results;

      // Comprobamos si el usuario lo ha dado like al post
      const likeUsuario = this.postsLikes.find(post => post.usuario == this.usuarioRegistrado[0].url);

      let num_likes = 0;
      // Si se al algun usuario significa que ya le ha dado like al Post 
      if (likeUsuario != undefined) {
        this.likeDado = true

        // Controlamos el numero de likes
        num_likes = this.postsLikes.length - 1

        // Si el usuario le ha dado like eliminaremos su coincidencia de la tabla Likes
        this._gestionLikesService.eliminarLike(likeUsuario.url).subscribe();

        // Si el usuario no le ha dado like, añadiremos una nueva coincidencia en la tabla Likes
      } else {
        this.likeDado = false

        // Controlamos el numero de likes
        num_likes = this.postsLikes.length + 1
        let like = new Likes(this.usuarioRegistrado[0].url, urlPost)
        this._gestionLikesService.guardarLike(like).subscribe();
      }

      this.actualizarNumLikes(num_likes, urlPost)
    });

  }

  // Actualiza el número de likes que tiene el post seleccionado
  actualizarNumLikes(num_likes: number, urlPost: string) {

    // Obtenemos los datos del post
    this._postService.obtenerPostUrl(urlPost).subscribe(data => {
      this.post = [data]

      // Actualizamsos los datos del post
      this.formularioPost.setValue({
        titulo: this.post[0].titulo,
        contenido: this.post[0].contenido,
        usuario: this.post[0].usuario,
        fecha_publicacion: this.post[0].fecha_publicacion,
        num_likes: num_likes,
      });

      this._postService.modificarPost(this.post[0].id, this.formularioPost.value).subscribe(data => {

        setTimeout(() => {
          this.ngOnInit()
        }, 5)

      })
    })
  }

}
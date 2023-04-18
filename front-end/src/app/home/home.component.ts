import { Component } from '@angular/core';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { Likes, Usuarios } from './home';
import { Post, PostLike } from '../post/post';
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
  public posts: Array<PostLike> = []
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

    //Obtenemos los datos del usuario logueado
    this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data => {
      this.usuarioRegistrado = [data]
      console.log('Usuario registrado', this.usuarioRegistrado[0])

      for(let p of this.posts){
        
        this._gestionLikesService.obtenerPosts(p.id).subscribe(data => {
          this.postsLikes = data.results;
          
          let likeUsuario = this.postsLikes.find(post => post.usuario == this.usuarioRegistrado[0].url);

          if(this.postsLikes.length == 0){
            p.likeDado = false;
          }else{
            if(likeUsuario!=undefined){
              p.likeDado = true;
            }else{
              p.likeDado = false;
            }
          }
        });
      }
    })

    })

    this.formularioPost = this.formBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      num_likes: [0 as number],

    });




  }

  gestionLikes(idPost: any, urlPost: any) {

    // Obtenemos el numero de coincidencias de este Post en la tabla Likes
    this._gestionLikesService.obtenerPosts(idPost).subscribe(data => {
      this.postsLikes = data.results;
      console.log("Post con like:" + this.postsLikes.length)

      // Comprobamos si el usuario lo ha dado like al post
      const likeUsuario = this.postsLikes.find(post => post.usuario == this.usuarioRegistrado[0].url);
      console.log('El usuario ha dado like a este post', likeUsuario)
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
import { Component } from '@angular/core';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { Likes, Usuarios } from './home';
import { Post } from '../post/post';
import { GestionLikesService } from '../gestion-likes.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

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
  public usuarioRegistrado:any = {}
  public likeDado:boolean = false;



  constructor(
    private _paginaPrincipalService: PaginaPrincipalService,
    private _gestionLikesService: GestionLikesService,
    private _obtenerUsuarioService: AutenticacionUsuariosService,
  ){

  }

    // Codigo que se ejecuta al cargar la pagina
    ngOnInit() {
      // Obtiene los post  
      this._paginaPrincipalService.getPost().subscribe(data => {
        this.posts = data.results;

      
      })
      
  }


  gestionLikes(idPost: any, urlPost: any){
    console.log(urlPost)

    // Obtenemos el numero de coincidencias de este Post en la tabla Likes
    this._gestionLikesService.obtenerPosts(idPost).subscribe(data=>{
      this.postsLikes = data.results;
        
      console.log('Likes dados al post' ,this.postsLikes)

      // Obtenemos las credenciales del usuario logueado
      this.credencialesUsuario = this._obtenerUsuarioService.obtenerCredenciales()
      console.log('Credenciales del usuario' ,this.credencialesUsuario)

      //Obtenemos los datos del usuario logueado
      this._obtenerUsuarioService.getUsuario(this.credencialesUsuario.id).subscribe(data =>{
        this.usuarioRegistrado = [data]
        console.log('Usuario registrado' ,this.usuarioRegistrado[0])

        // Comprobamos si el usuario lo ha dado like al post
        const likeUsuario = this.postsLikes.find(post => post.usuario ==  this.usuarioRegistrado[0].url);
        console.log('El usuario ha dado like a este post' ,likeUsuario != undefined)

        // Si se al algun usuario significa que ya le ha dado like al Post 
        if (likeUsuario != undefined){
          this.likeDado = true
          
             // Controlamos el numero de likes
          const num_likes = this.postsLikes.length-1
          console.log("Numero de likes del post:", num_likes)

          // Si el usuario le ha dado like eliminaremos su coincidencia de la tabla Likes
          this._gestionLikesService.eliminarLike(likeUsuario.url).subscribe();
        

          // Si el usuario no le ha dado like, añadiremos una nueva coincidencia en la tabla Likes
        }else{
          this.likeDado = false

          // Controlamos el numero de likes
          const num_likes = this.postsLikes.length+1
          console.log("Numero de likes del post:", num_likes)
          let like = new Likes(this.usuarioRegistrado[0].url, urlPost)
          this._gestionLikesService.guardarLike(like).subscribe();
          console.log("Nuevo Like:", like)
        }

        }); 
    
    })

  }
}

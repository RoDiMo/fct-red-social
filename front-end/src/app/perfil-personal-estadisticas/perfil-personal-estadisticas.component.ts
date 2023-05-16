import { Component } from '@angular/core';
import { Post } from '../post/post';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-perfil-personal-estadisticas',
  templateUrl: './perfil-personal-estadisticas.component.html',
  styles: [
  ]
})
export class PerfilPersonalEstadisticasComponent {

  public postsUsuario!: Array<Post>;
  public postsMasViews!: Array<Post>;
  public postMasLikes!: Array<Post>; 

  public credenciales = this._obtenerUsuario.obtenerCredenciales();
  public datosUsuario!: PerfilUsuario;

  public numeroPosts!: number;



  public sumaViews!: number;
  public mediaViews!: number;
  public maxViews!: any;

  public sumaLikes!: number;
  public mediaLikes!: number;
  public maxLikes!: number;





  constructor(
    private _perfilUsuarioService: PerfilUsuarioService,
    public _obtenerUsuario : AutenticacionUsuariosService,
    private _postService: PostService,

  ){}


  ngOnInit(): void{
    this._perfilUsuarioService.getPerfilUsuario(this.credenciales.id).subscribe( data => {
      this.datosUsuario = data

      this.obtenerPostUsuario()

      
    });
  }


  // Obtenemos los posts creados por el usuario
  obtenerPostUsuario(){
    this._postService.obtenerPostsUsuario(this.credenciales.id).subscribe( data => {
      this.postsUsuario = data.results 

      // Obtenemos el numero de posts del usuario
      this.numeroPosts = this.postsUsuario.length

       // Obtenemos las medias de likes y visitas del usuario
      this.obtenerMedia(this.postsUsuario)

       // Obtenemos el maximo de likes y visitas del usuario
      this.maxViews = this.postsUsuario.reduce(this.obtenerMaxViews, this.postsUsuario[0]).num_visitas;
      this.maxLikes = this.postsUsuario.reduce(this.obtenerMaxLikes, this.postsUsuario[0]).num_likes;
      
      // Obtenemos los post ordenasdos por numero de likes
      this.postMasLikes = this.postsUsuario.sort(this.ordenarPostLikes)

      // Obtenemos los post ordenasdos por numero de visitas
      this.postsMasViews = this.postsUsuario.sort(this.ordenarPostViews)

  
    })
  }


  obtenerMedia(post:any){
    this.sumaViews = post.reduce(this.obtenerSumaViews,0)
    this.sumaLikes = post.reduce(this.obtenerSumaLikes,0)

    this.mediaViews = this.sumaViews / post.length
    this.mediaLikes = this.sumaLikes / post.length
  }

  // Suma de las visitas
  obtenerSumaViews(total: any, view: any){
    return total + view.num_visitas
  }

  // Suma de los likes
  obtenerSumaLikes(total: any, view: any){
    return total + view.num_likes
  }

  // Maximo numero de visitas
  obtenerMaxViews(total: any, view: any){
    return view.num_visitas > total.num_visitas ? view : total;
  }

   // Maximo numero de likes
  obtenerMaxLikes(total: any, view: any){
    return view.num_likes > total.num_likes ? view : total;
  }

  // Ordenar los post por numero de likes
  ordenarPostLikes(a: any, b: any){
    return b.num_likes - a.num_likes
  }

    // Ordenar los post por visitas
  ordenarPostViews(a: any, b: any){
    return b.num_visitas - a.num_visitas
  }

}

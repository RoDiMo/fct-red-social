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



  obtenerPostUsuario(){
    this._postService.obtenerPostsUsuario(this.credenciales.id).subscribe( data => {
      this.postsUsuario = data.results 

      this.numeroPosts = this.postsUsuario.length

      this.obtenerMedia(this.postsUsuario)

      this.maxViews = this.postsUsuario.reduce(this.obtenerMaxViews, this.postsUsuario[0]).num_visitas;
      this.maxLikes = this.postsUsuario.reduce(this.obtenerMaxLikes, this.postsUsuario[0]).num_likes;
      
      this.postMasLikes = this.postsUsuario.sort(this.ordenarPostLikes)

      this.postsMasViews = this.postsUsuario.sort(this.ordenarPostViews)

  
    })
  }

  obtenerMedia(post:any){
    this.sumaViews = post.reduce(this.obtenerSumaViews,0)
    this.sumaLikes = post.reduce(this.obtenerSumaLikes,0)

    this.mediaViews = this.sumaViews / post.length
    this.mediaLikes = this.sumaLikes / post.length
  }

  obtenerSumaViews(total: any, view: any){
    return total + view.num_visitas
  }


  obtenerSumaLikes(total: any, view: any){
    return total + view.num_likes
  }

  obtenerMaxViews(total: any, view: any){
    return view.num_visitas > total.num_visitas ? view : total;
  }

  obtenerMaxLikes(total: any, view: any){
    return view.num_likes > total.num_likes ? view : total;
  }

  ordenarPostLikes(a: any, b: any){
    return b.num_likes - a.num_likes
  }

  ordenarPostViews(a: any, b: any){
    return b.num_visitas - a.num_visitas
  }

}

import { Component } from '@angular/core';
import { Post } from '../post/post';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PostService } from '../post.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
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

  public numeroPosts: number = 0;



  public sumaViews: number = 0;
  public mediaViews: number = 0;
  public maxViews: number = 0;

  public sumaLikes: number = 0;
  public mediaLikes: number = 0;
  public maxLikes: number = 0;

  public sumaComentarios: number = 0;
  public mediaComentarios: number = 0;

  public contenidoCargado: boolean = false;

  constructor(
    private _perfilUsuarioService: PerfilUsuarioService,
    public _obtenerUsuario: AutenticacionUsuariosService,
    private _postService: PostService,
    private location: Location,
    public router: Router,

  ) { }


  ngOnInit(): void {
    if(!this.credenciales){
      this.credenciales = {"token":"8f78c9b24891cc8041ec9d3e39b4ee07b045de7","id":0,"username":"pruebatest"}
    }

    this._perfilUsuarioService.getPerfilUsuario(this.credenciales.id).subscribe(data => {
      this.datosUsuario = data

      this.obtenerPostUsuario()
    });

    setTimeout(() => {
      this.contenidoCargado = true;
  
    }, 500)
  }

  enlaceAmigos() {

    //this.location.replaceState(`/amigos`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'amigos');
    this.router.navigateByUrl(`/amigos`);
    //location.reload();
  }

  enlacePerfil() {
    //this.location.replaceState(`/perfil-personal`);
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'perfil-personal');
    this.router.navigateByUrl(`/perfil-personal`);
    //location.reload();
  }


  // Obtenemos los posts creados por el usuario
  obtenerPostUsuario() {
    this._postService.obtenerPostsUsuario(this.credenciales.id).subscribe(data => {
      this.postsUsuario = data.results

      // Obtenemos el numero de posts del usuario
      this.numeroPosts = this.postsUsuario.length

      // Obtenemos las medias de likes y visitas del usuario
      this.obtenerMedia(this.postsUsuario)

      // Obtenemos el maximo de likes y visitas del usuario
      // Si el usuario no ha publicado ningun post los valores por defecto serán 0
      if (this.postsUsuario.length != 0) {
        this.maxViews = this.postsUsuario.reduce(this.obtenerMaxViews, this.postsUsuario[0]).num_visitas;
        this.maxLikes = this.postsUsuario.reduce(this.obtenerMaxLikes, this.postsUsuario[0]).num_likes;
      }
      //console.log(this.postsUsuario[0])

      // Obtenemos los post ordenasdos por numero de likes
      // Si el usuario no ha publicado ningun post los valores por defecto serán 0
      this.postMasLikes = this.postsUsuario.sort(this.ordenarPostLikes).slice(0,2)

      // Obtenemos los post ordenasdos por numero de visitas
      // Si el usuario no ha publicado ningun post los valores por defecto serán 0
      this.postsMasViews = this.postsUsuario.sort(this.ordenarPostViews).slice(0,2)


    })
  }


  // Obtenemos la media de views, likes y comentarios del usuario
  // Si el usuario no ha publicado ningun post los valores por defecto serán 0
  obtenerMedia(post: any) {
    if (post.length != 0) {
      this.sumaViews = post.reduce(this.obtenerSumaViews, 0)
      this.sumaLikes = post.reduce(this.obtenerSumaLikes, 0)
      this.sumaComentarios = post.reduce(this.obtenerSumaComentarios, 0)


      this.mediaViews = this.sumaViews / post.length
      this.mediaLikes = this.sumaLikes / post.length
      this.mediaComentarios = this.sumaComentarios / post.length
     
    }
  }

  // Suma los comentarios 
  obtenerSumaComentarios(total: any, comentario: any) {
    return total + comentario.num_comentarios
  }

  // Suma de las visitas
  obtenerSumaViews(total: any, view: any) {
    return total + view.num_visitas
  }

  // Suma de los likes
  obtenerSumaLikes(total: any, view: any) {
    return total + view.num_likes
  }

  // Maximo numero de visitas
  obtenerMaxViews(total: any, view: any) {
    return view.num_visitas > total.num_visitas ? view : total;
  }

  // Maximo numero de likes
  obtenerMaxLikes(total: any, view: any) {
    return view.num_likes > total.num_likes ? view : total;
  }

  // Ordenar los post por numero de likes
  ordenarPostLikes(a: any, b: any) {
    return b.num_likes - a.num_likes
  }

  // Ordenar los post por visitas
  ordenarPostViews(a: any, b: any) {
    return b.num_visitas - a.num_visitas
  }

}

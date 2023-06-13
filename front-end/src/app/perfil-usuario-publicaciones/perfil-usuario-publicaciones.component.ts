import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { PostService } from '../post.service';
import { Post } from '../post/post';

@Component({
  selector: 'app-perfil-usuario-publicaciones',
  templateUrl: './perfil-usuario-publicaciones.component.html',
  styles: [
  ]
})
export class PerfilUsuarioPublicacionesComponent {
  public id = this.activatedRoute.snapshot.paramMap.get('id');
  public postsUsuario!: Array<Post>;
  public credenciales = this._obtenerUsuarioService?.obtenerCredenciales();
  public contenidoCargado: boolean = false;


  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    private _postService: PostService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  
  ngOnInit() : void{
    console.log(this.id)
    this._postService.obtenerPostsUsuario(this.id!).subscribe( data => {
      this.postsUsuario = data.results   
    });

    setTimeout(() => {
      this.contenidoCargado = true;
  
    }, 500);
  }

   // Enlace al post seleccionadp
   enlacePost(id:String){
    this.router.navigateByUrl(`/post/${id}`)
  }

}



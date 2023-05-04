import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


  constructor(
    public _obtenerUsuarioService: AutenticacionUsuariosService,
    private _postService: PostService,
    private activatedRoute: ActivatedRoute,
  ) { }

  
  ngOnInit() : void{
    this._postService.obtenerPostsUsuario(this.id!).subscribe( data => {
      this.postsUsuario = data.results   
    })
  }

}



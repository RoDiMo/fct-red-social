import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from './post';
import { Comentario } from '../comentario/comentario';
import { ComentariosService } from '../comentarios.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styles: [
  ]
})
export class PostComponent implements OnInit{
  public posts: Array<Post> = []
  public comentarios: Array<Comentario> = []

  constructor(private _postService: PostService,
              private _comentarioService: ComentariosService,
              private activatedRoute: ActivatedRoute,
              private router: Router,){ }

    
  ngOnInit(): void {
    
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this._postService.obtenerPost(id).subscribe({
      next: (data) => {
        this.posts = [data];
  
        console.log(this.posts)

      },
      error: (error) => {
        console.log(error);
      }
    })

    this._comentarioService.obtenerComentarios().subscribe({
      next: (data)=>{
        this.comentarios = data.results
        console.log(this.comentarios)
      }
    })
  }

}

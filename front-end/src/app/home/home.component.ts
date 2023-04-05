import { Component } from '@angular/core';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { Usuarios } from './home';
import { Post } from '../post/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  public posts: Array<Post> = []

  constructor(
    private _paginaPrincipalService: PaginaPrincipalService,
  ){

  }

    // Codigo que se ejecuta al cargar la pagina
    ngOnInit() {
      // Obtiene los post  
      this._paginaPrincipalService.getPost().subscribe(data => {
        this.posts = data.results;

        console.log(this.posts)
      })
      
  }
}

import { Component } from '@angular/core';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { Usuarios } from './home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  public datos: Array<any> = []

  constructor(
    private _paginaPrincipalService: PaginaPrincipalService,
  ){

  }

    // Codigo que se ejecuta al cargar la pagina
    ngOnInit() {
      // Obtiene los post  
      this._paginaPrincipalService.getPost().subscribe(data => {
        this.datos = data;
        console.log(this.datos)
      })
      
  }
}

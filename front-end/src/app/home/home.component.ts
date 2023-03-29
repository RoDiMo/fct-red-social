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
  public datos: Array<Usuarios> = []

  constructor(
    private _paginaPrincipalService: PaginaPrincipalService,
  ){

  }

    ngOnInit() {
      this._paginaPrincipalService.getUsuario().subscribe(data => {
        this.datos = data;
        console.log(this.datos)
      })
  }
}

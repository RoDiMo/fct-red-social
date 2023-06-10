import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detalle-post-modal',
  templateUrl: './detalle-post-modal.component.html',
  styles: [
  ]
})
export class DetallePostModalComponent {

  @Input() datosPost!: any;


  ngOnInit() {
    console.log( this.datosPost.titulo)
    console.log( this.datosPost.contenio)
  }



}

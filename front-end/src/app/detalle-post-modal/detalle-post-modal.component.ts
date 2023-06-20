import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detalle-post-modal',
  templateUrl: './detalle-post-modal.component.html',
  styles: [
  ]
})
export class DetallePostModalComponent {

  // Obtenemos los datos del post
  @Input() datosPost?: any;


  ngOnInit() {

  }



}

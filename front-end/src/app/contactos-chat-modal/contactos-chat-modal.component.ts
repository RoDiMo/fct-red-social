import { Component, Input } from '@angular/core';
import { AmigosChat } from '../amigos/amigo';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contactos-chat-modal',
  templateUrl: './contactos-chat-modal.component.html',
  styles: [
  ]
})
export class ContactosChatModalComponent {
  @Input() datosAmigos?: Array<AmigosChat> = []


  constructor(
    public location: Location,
  ) { }

  ngOnInit() {
  
  }
      // Redirigimos a la id del usuario con el que queremos chatear
      redirigirChat(idAmigo: string) {

        this.location.replaceState(`/chat/${idAmigo}`)
        location.reload();
      }
  
}


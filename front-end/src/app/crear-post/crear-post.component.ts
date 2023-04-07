import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styles: [
  ]
})
export class CrearPostComponent implements OnInit {
  private credenciales!: PerfilUsuario;
  private usuario!: PerfilUsuario;
  formularioPost!: FormGroup;
  public post: any = {};
  public modoEdicion: boolean = false;


  constructor(
    public obtenerUsuario: PerfilUsuarioService,
    public obtenerCredenciales: AutenticacionUsuariosService,
    public formBuilder: FormBuilder,
    public _postService: PostService,
    public activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    // Comprobamos si el formulario recibe una id o no
    // 1. Si se recibe una id, significa que se debe modificar un post ya existente
    // 2. Si no se recibe una id, significa que se debe crear un post nuevo

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) { // -------> MODO EDICION <-------

      // En la modificacion solo trabajaremos con los valores de titulo, contenido e usuario (La imagen se modifica aparte)
      this.formularioPost = this.formBuilder.group({
        titulo: ['' as string | null, Validators.required],
        contenido: ['' as string | null, Validators.required],
        usuario: ['' as string],

      });
      // Variable que determina si estamos editando o creando un post
      // Esta variable se envia al template, haciendo que muestre unos valores u otros
      this.modoEdicion = true;

      // Obtenemos los valores del post que queremos editar
      this._postService.obtenerPost(id).subscribe(data => {
        this.post = data

        // Asignamos al formulario, los valores que tiene el post por defecto
        this.formularioPost.setValue({
          titulo: this.post.titulo,
          contenido: this.post.contenido,
          usuario: this.post.usuario,

        });
      })

    } else {// -------> MODO CREACION <-------

      // En la creacion incluimos el campo imagen
      this.formularioPost = this.formBuilder.group({
        titulo: ['' as string | null, Validators.required],
        contenido: ['' as string | null, Validators.required],
        usuario: ['' as string],
        imagen: [null],
      });

      // Obtengo las credenciales del usuario que hay en sesion
      this.credenciales = this.obtenerCredenciales.obtenerCredenciales();

      if (this.credenciales && this.credenciales.id) {
        // Obtengo al usuario que coincide con las credenciales
        this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe({
          next: (data: PerfilUsuario) => {
            this.usuario = data


            // Añado el usuario a los valores del formulario
            this.formularioPost.setValue({
              titulo: '' as any,
              contenido: '' as string | null,
              usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,
              imagen: null,
            });

          }
        });

      }
    }
  }


  // Función para manejar la selección de una imagen por parte del usuario
  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (file != null) {
      this.formularioPost.get('imagen')?.setValue(file); // se asigna el archivo seleccionado a su campo del formulario
    }
  }


  enviaPost() {

    // FormData para enviar los valores del formulario al servidor como datos (Necesario para guardar la imagen)
    const formData: any = new FormData();
    formData.append('titulo', this.formularioPost.get('titulo')?.value);
    formData.append('contenido', this.formularioPost.get('contenido')?.value);
    formData.append('usuario', this.formularioPost.get('usuario')?.value);
    formData.append('imagen', this.formularioPost.get('imagen')?.value);

    // Si no estamos editando, creamos un nuevo post, de lo contrario modificamos los valores de uno ya existente
    if (!this.modoEdicion) {
      this._postService.nuevoPost(formData).subscribe(data => { });
    } else {
      this._postService.modificarPost(this.post.id, this.formularioPost.value).subscribe();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { HttpErrorResponse } from '@angular/common/http';
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
  public formData: FormData = new FormData();
  public caracRestantes: number = 1024;
  public caracSobrantes?: number
  public quedanCaracteres: boolean = true;
  public errors: Array<any> = [];

  constructor(
    public obtenerUsuario: PerfilUsuarioService,
    public obtenerCredenciales: AutenticacionUsuariosService,
    public formBuilder: FormBuilder,
    public _postService: PostService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) {
    this.formularioPost = this.formBuilder.group({
      titulo: new FormControl(''), //['' as string | null, Validators.required],
      contenido: new FormControl(''), //['' as string | null, Validators.required],
      usuario: new FormControl(''), //['' as string],

    });
  }

  ngOnInit(): void {


    // Comprobamos si el formulario recibe una id o no
    // 1. Si se recibe una id, significa que se debe modificar un post ya existente
    // 2. Si no se recibe una id, significa que se debe crear un post nuevo

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    // -------> MODO EDICION <-------
    if (id) {

      // En la modificacion solo trabajaremos con los valores de titulo, contenido e usuario (La imagen se modifica aparte)

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

        this.controlarCaracteres(this.post.contenido)
        this.formularioPost.valueChanges.subscribe(data => {
          this.controlarCaracteres(data.contenido)
        })

        //
      })

    } else {// -------> MODO CREACION <-------

      // En la creacion incluimos el campo imagen
      this.formularioPost = this.formBuilder.group({
        titulo: ['' as string | null, Validators.required],
        contenido: ['' as string | null, Validators.required],
        usuario: ['' as string],
        imagen: null,
      });

      this.formularioPost.valueChanges.subscribe(data => {
        this.controlarCaracteres(data.contenido)
      })

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
      this.formData.append('imagen', file);


      //this.formularioPost.get('imagen')?.setValue(file); // se asigna el archivo seleccionado a su campo del formulario
    }
  }


  enviaPost() {

    // FormData para enviar los valores del formulario al servidor como datos (Necesario para guardar la imagen)


    this.formData.append('titulo', this.formularioPost.get('titulo')?.value);
    this.formData.append('contenido', this.formularioPost.get('contenido')?.value);
    this.formData.append('usuario', this.formularioPost.get('usuario')?.value);


    // Si no estamos editando, creamos un nuevo post, de lo contrario modificamos los valores de uno ya existente
    if (!this.modoEdicion) {
      this._postService.nuevoPost(this.formData).subscribe(data => {

        if (data.status == 201) {
          this.router.navigateByUrl(`/`);
        }
        /*
        setTimeout(() => {
          this.router.navigateByUrl(`/`);
        }, 50)
        */
      }, err => {
        if (err instanceof HttpErrorResponse) {
          const ValidationErrors = err.error;
          Object.keys(ValidationErrors).forEach(prop => {
            const formControl = this.formularioPost.get(prop);
            if (formControl) {
              formControl.setErrors({
                serverError: ValidationErrors[prop]
              })
            }
          })
        }
        this.errors = err.error.message;
      });



    } else {
      this._postService.modificarPost(this.post.id, this.formularioPost.value).subscribe(data => {

        if (data.status == 200) {
        this.router.navigateByUrl(`post/${this.post.id}`);
        }
      }, err => {
        if (err instanceof HttpErrorResponse) {
          const ValidationErrors = err.error;
          Object.keys(ValidationErrors).forEach(prop => {
            const formControl = this.formularioPost.get(prop);
            if (formControl) {
              formControl.setErrors({
                serverError: ValidationErrors[prop]
              })
            }
          })
        }
        this.errors = err.error.message;
      }
      );

    }


  }


  // Funcion para controlar que el número de caracteres no sobrepase la capacidad permitida
  controlarCaracteres(contenido: string) {
    this.caracRestantes = 1024 - contenido.length

    if (this.caracRestantes > 0) {
      this.quedanCaracteres = true
    } else {
      this.quedanCaracteres = false
      this.caracSobrantes = - (1024 - contenido.length)
      this.caracRestantes = 0
    }

  }

}

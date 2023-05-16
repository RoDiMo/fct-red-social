import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Post } from '../post/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ComentariosService } from '../comentarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comentario } from '../comentario/comentario';
import { PostService } from '../post.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-comentario',
  templateUrl: './crear-comentario.component.html',
  styles: [
  ]
})
export class CrearComentarioComponent implements OnInit{

  public credenciales!: PerfilUsuario;
  public usuario!: PerfilUsuario;
  public post!: Post;
  public idPost: any = {};
  public comentario: any = {};
  public formularioComent!: FormGroup;

  public caracRestantes: number= 1024;
  public caracSobrantes?: number
  public quedanCaracteres: boolean = true;
  public errors : Array<any> = [];



  constructor(
                public obtenerUsuario: PerfilUsuarioService, 
                public obtenerCredenciales: AutenticacionUsuariosService,
                public formBuilder: FormBuilder,
                public _comentarioService: ComentariosService,
                public _postService: PostService,
                public activatedRoute: ActivatedRoute,
                public router: Router,
                private http: HttpClient
            ){
              
                this.formularioComent = this.formBuilder.group({
                  contenido: ['' as string | null, Validators.required],
                  post: ['' as string],
                  usuario: ['' as string],
                })
                 
            }
  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this._comentarioService.obtenerComentario(id).subscribe(data=>{
      this.comentario = data

      this.formularioComent.setValue({
        contenido: this.comentario.contenido as any,
        post: this.comentario.post,
        usuario: this.comentario.usuario,
      });
  
      this.controlarCaracteres(this.comentario.contenido)
      console.log(this.comentario.usuario)
    })


  }

  editarComentario(){
    console.log(this.comentario.post)

    this.http.get<any>(this.comentario.post).subscribe(data => {
      this.idPost = data
      console.log(this.idPost.id)

      this._comentarioService.editarComentario(this.comentario.id, this.formularioComent.value).subscribe(data =>{
        this.router.navigateByUrl(`post/${this.idPost.id}`);
      }, err => {
        if (err instanceof HttpErrorResponse) {
          const ValidationErrors = err.error;
          Object.keys(ValidationErrors).forEach(prop => {
            const formControl = this.formularioComent.get(prop);
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
   
    })

  }

  controlarCaracteres(contenido: string){
    this.caracRestantes = 1024 - contenido.length

    if(this.caracRestantes > 0){
      this.quedanCaracteres = true
    }else{
      this.quedanCaracteres = false
      this.caracSobrantes = -(1024 - contenido.length)
      this.caracRestantes = 0
    }
   
  }
}

import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../post.service';
@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styles: [
  ]
})
export class CrearPostComponent implements OnInit{
  private credenciales!: PerfilUsuario;
  private usuario!: PerfilUsuario;
  formularioPost;


  constructor(
              private obtenerUsuario: PerfilUsuarioService, 
              private obtenerCredenciales: AutenticacionUsuariosService,
              private formBuilder: FormBuilder,
              private publicarPost: PostService,
              ){

                this.formularioPost = this.formBuilder.group({
                  titulo: ['' as string | null, Validators.required],
                  contenido: ['' as string | null, Validators.required],
                  usuario: ['' as string],
                  imagen: [null],
                });

              }

  ngOnInit(): void {

    // Obtengo las credenciales del usuario que hay en sesion
    this.credenciales = this.obtenerCredenciales.obtenerCredenciales();
    

    // Obtengo al usuario que coincide con las credenciales
    this.obtenerUsuario.getPerfilUsuario(this.credenciales.id).subscribe({
      next: (data: PerfilUsuario) =>{
        this.usuario = data
        console.log(this.usuario.id)

        
        // Añado el objeto usuario a los valores del formulario
        this.formularioPost.setValue({
          titulo: '' as any,
          contenido: '' as string | null,
          usuario: `http://localhost:8000/usuarios/${this.usuario.id.toString()}/`,
          imagen: null,
        });
      
      }
    });
  }

// Función para manejar la selección de una imagen por parte del usuario
  onFileSelected(event:any) {
    const file = event.target.files[0];
    this.formularioPost.get('imagen')?.setValue(file); // se asigna el archivo seleccionado al control de imagen
    }

  
  nuevoPost(){
   
    // FormData para enviar los datos del formulario al servidor

    const formData:any = new FormData();
    formData.append('titulo', this.formularioPost.get('titulo')?.value);
    formData.append('contenido', this.formularioPost.get('contenido')?.value);
    formData.append('usuario', this.formularioPost.get('usuario')?.value);
    formData.append('imagen', this.formularioPost.get('imagen')?.value);
 

    this.publicarPost.nuevoPost(formData).subscribe(data => {});
  }
}

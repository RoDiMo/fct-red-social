import { Component } from '@angular/core';
import { Post } from '../post/post';
import { PostService } from '../post.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-posts',
  templateUrl: './admin-posts.component.html',
  styles: [
  ]
})
export class AdminPostsComponent {
  public posts: Array<Post> = [];
  public usuarios: Array<PerfilUsuario> = []
  public usuarioRegistrado!: PerfilUsuario;
  public credenciales = this._usuarioService?.obtenerCredenciales();
  public postOcultado!: FormGroup;
  public ordenarCampo: boolean = false;
  public campoSeleccionado: string = "-fecha_publicacion";
  public valorBusqueda: string = "";
  public campos: any = {};
  public contenidoCargado: boolean = false;
  public fecha_inicio: string = ""
  public fecha_fin: string = "";
  public p: number = 1;


  constructor(
    public _postService: PaginaPrincipalService,
    public _actualizarPost: PostService,
    public _usuarioService: AutenticacionUsuariosService,
    public _adminService: AdminService,
    public formBuilder: FormBuilder,
    public router: Router,
  ) {
    this.postOcultado = this.formBuilder.group({
      titulo: ['' as string | null, Validators.required],
      contenido: ['' as string | null, Validators.required],
      usuario: ['' as string],
      fecha_publicacion: ['' as any],
      oculto: [false as boolean]
    })

    // Campos de la tabla de los posts. 
    // La clave del diccionario es el valor de búsqueda del elemento del post
    this.campos = {
      titulo: 'Titulo',
      usuario__username: 'Autor',
      num_visitas: 'Visitas',
      num_likes: 'Likes',
      num_comentarios: 'Comentarios',
      oculto: 'Estado',
      fecha_publicacion: 'Fecha',
    }

    this.camposNoOrdenados()

    //const fechaFin = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
    //this.fecha_fin = this.obtenerFechaFormateada(fechaFin);
  }

  // Funcion que evita que los campos del diccionario se ordenen al ser llamados desde el template
  camposNoOrdenados() {
    return Object.entries(this.campos);
  }

  ngOnInit(): void {
    this.obtenerPost()
    this.obtenerUsuarios()
    this.obtenerUsuarioRegistrado()

    setTimeout(() => {
      this.contenidoCargado = true;

    }, 500)


  }



  // Obtenemos los valores del usuario registrado
  obtenerUsuarioRegistrado() {
    this._usuarioService.getUsuario(this.credenciales?.id).subscribe(data => {
      this.usuarioRegistrado = data

      // Si el usuario no tiene privilgios de administracion se le redirigirá a la página de inicio
      if (!this.usuarioRegistrado.es_moderador && !this.usuarioRegistrado.is_staff) {
        this.router.navigate(['/'])
      }
    })
  }

  enlaceAplicacion() {
    this.router.navigate(['/'])
    localStorage.removeItem(`enlace-cabecera`)
    localStorage.setItem(`enlace-cabecera`, 'inicio');
  }

  /**
   * Función que ordena un listado de post en dependencia de un campo en concreto
   * @param campo Campo del post por el que se va a ordenar
   */
  ordenarPosts(campo: string) {

    this.campoSeleccionado = campo
    // Booleano que controla la dirección en la que se ordenará
    this.ordenarCampo = !this.ordenarCampo

    // Si devuelve True, ordenará los campos de forma descendente
    if (this.ordenarCampo) {
      campo = '-' + campo
    }

    // Nos traemos los posts ordenados en función del campo
    this._adminService.ordenarPosts(campo, this.valorBusqueda, this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.posts = data.results
    })
  }


  // Ordenamos ascendente o descendentemente los valores de búsqueda en dependencia del valor de ordenarCampo
  // True : Se ordenan los campos descendentemente
  // False : Se ordenan los campos ascendentemente
  guardarValorBusqueda() {

    if (this.ordenarCampo) {
      this.campoSeleccionado = '-' + this.campoSeleccionado
      this.ordenarCampo = !this.ordenarCampo

    }

    // Nos traemos los posts ordenados en función del campo
    this._adminService.ordenarPosts(this.campoSeleccionado, this.valorBusqueda, this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.posts = data.results
    })
  }


  // Obtiene los posts ordenados por fecha
  obtenerPost() {
    this._postService.getPost().subscribe(data => {
      this.posts = data.results

    })
  }

  // Obtiene los usuarios ordenados por fecha
  obtenerUsuarios() {
    this._adminService.ordenarUsuarios('username', "", this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.usuarios = data.results

    })
  }

  /**
   * Función para ocultar los posts
   * @param id Id del post
   * @param post Post que vamos a ocultar
   */
  ocultarPost(id: string, post: Post) {
    this.postOcultado.patchValue({
      titulo: post.titulo,
      contenido: post.contenido,
      usuario: post.usuario,
      fecha_publicacion: post.fecha_publicacion,
      oculto: true
    })

    this._actualizarPost.modificarPost(id, this.postOcultado.value).subscribe(data => {

      if (data.status == 200) {
        this.guardarValorBusqueda();
      }

      /*
      setTimeout(() => {
        this.guardarValorBusqueda();

      }, 5)
      */
    })
  }

  /**
 * Función para hacer visibles a los posts
 * @param id Id del post
 * @param post Post que vamos a mostrar
 */
  mostrarPost(id: string, post: Post) {
    this.postOcultado.patchValue({
      titulo: post.titulo,
      contenido: post.contenido,
      usuario: post.usuario,
      fecha_publicacion: post.fecha_publicacion,
      oculto: false
    })

    this._actualizarPost.modificarPost(id, this.postOcultado.value).subscribe(data => {

      if (data.status == 200) {
        this.guardarValorBusqueda();
      }

      /*
      setTimeout(() => {
        this.guardarValorBusqueda();

      }, 5)
      */
    })
  }


}

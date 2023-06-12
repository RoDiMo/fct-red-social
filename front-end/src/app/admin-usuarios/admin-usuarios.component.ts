import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../post/post';
import { AdminService } from '../admin.service';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';
import { PaginaPrincipalService } from '../pagina-principal.service';
import { PostService } from '../post.service';
import { PerfilUsuario } from '../perfil-usuario/perfil-usuario';
import { PerfilUsuarioService } from '../perfil-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styles: [
  ]
})
export class AdminUsuariosComponent {

  public posts: Array<Post> = [];
  public usuarios: Array<PerfilUsuario> = []
  public usuarioRegistrado!: PerfilUsuario;
  public credenciales = this._usuarioService.obtenerCredenciales();
  public usuarioModerador!: FormGroup;
  public ordenarCampo: boolean = false;
  public campoSeleccionado: string = "username";
  public valorBusqueda: string = "";
  public orden: string = ""
  public campos: any = {};
  public contenidoCargado: boolean = false;
  public fecha_inicio: string = ""
  public fecha_fin: string = "";

  constructor(
    public _postService: PaginaPrincipalService,
    public _actualizarPost: PostService,
    public _usuarioService: AutenticacionUsuariosService,
    public _editarUsuario: PerfilUsuarioService,
    public _adminService: AdminService,
    public formBuilder: FormBuilder,
    private router: Router,



  ) {
    this.usuarioModerador = this.formBuilder.group({
      es_moderador: [false as boolean]
    })

    // Campos de la tabla de los usuarios. 
    // La clave del diccionario es el valor de búsqueda del elemento del usuario
    this.campos = {
      username: 'Usuario',
      first_name: 'Nombre',
      email: 'Email',
      pais: 'Pais',
      estado: 'Estado',
      ciudad: 'Ciudad',
      direccion: 'Direccion',
      es_moderador: 'Tipo de usuario',
      fecha_alta: 'Fecha de Alta',

    }

    this.camposNoOrdenados()
  }

   // Funcion que evita que los campos del diccionario se ordenen al ser llamados desde el template
  camposNoOrdenados() {
    return Object.entries(this.campos);
  }

  ngOnInit(): void {
    this.obtenerUsuarios()
    this.obtenerPost()
    this.obtenerUsuarioRegistrado()

    setTimeout(() => {
      this.contenidoCargado = true;
  
    }, 500)
    
  }

  enlaceAplicacion(){
    this.router.navigate(['/'])
  }

   // Obtenemos los valores del usuario registrado
  obtenerUsuarioRegistrado() {
    this._usuarioService.getUsuario(this.credenciales.id).subscribe(data => {
      this.usuarioRegistrado = data

       // Si el usuario no tiene privilgios de administracion se le redirigirá a la página de inicio
      if (!this.usuarioRegistrado.es_moderador && !this.usuarioRegistrado.is_staff) {
        this.router.navigate(['/'])
      }
    })
  }

  /**
   * Función que ordena un listado de post en dependencia de un campo en concreto
   * @param campo Campo del post por el que se va a ordenar
   */
  ordenarUsuarios(campo: string) {

    this.campoSeleccionado = campo
    // Booleano que controla la dirección en la que se ordenará
    this.ordenarCampo = !this.ordenarCampo

    // Si devuelve True, ordenará los campos de forma descendente

    if (this.ordenarCampo) {
      campo = '-' + campo
    }

    // Nos traemos los posts ordenados en función del campo
    this._adminService.ordenarUsuarios(campo, this.valorBusqueda, this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.usuarios = data.results
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
    this._adminService.ordenarUsuarios(this.campoSeleccionado, this.valorBusqueda, this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.usuarios = data.results
    })
  }


  // Obtiene los usuarios ordenados por fecha
  obtenerUsuarios() {
    this._adminService.ordenarUsuarios('username', "", this.fecha_inicio, this.fecha_fin).subscribe(data => {
      this.usuarios = data.results

    })
  }


  // Obtiene los posts ordenados por fecha
  obtenerPost() {
    this._postService.getPost().subscribe(data => {
      this.posts = data.results

    })
  }

  /**
   * Función para ocultar los posts
   * @param id Id del post
   * @param post Post que vamos a ocultar
   */
  agregarModerador(id: string, usuario: PerfilUsuario) {
    this.usuarioModerador.patchValue({
      es_moderador: true
    })

    this._editarUsuario.editarDatosPerfil(id, this.usuarioModerador.value).subscribe(data => {
      
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
  quitarModerador(id: string, usuario: PerfilUsuario) {
    this.usuarioModerador.patchValue({
      es_moderador: false
    })

    this._editarUsuario.editarDatosPerfil(id, this.usuarioModerador.value).subscribe(data => {
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

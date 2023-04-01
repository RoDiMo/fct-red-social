import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AutenticacionUsuariosService } from '../autenticacion-usuarios.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styles: [
  ]
})
export class RegistroUsuarioComponent {
  public datos:Array<any> = [];
  public formulario!: FormGroup;
  public response: any;
  public UrlImagen: any;

  constructor(
    private fb: FormBuilder,
    private registroUsuario: AutenticacionUsuariosService,
  ) {}

  ngOnInit() {

    this.formulario = this.fb.group({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      first_name : new FormControl(''),
      last_name : new FormControl(''),
      telefono : new FormControl(''),
      pais : new FormControl(''),
      estado : new FormControl(''),
      ciudad : new FormControl(''),
      direccion : new FormControl(''),
      foto_perfil:new FormControl(''),
    })
  }

  onChange(event:any){
    if (event.target.files.length > 0) {
      const imagen = event.target.files[0];
      this.formulario.get('foto_perfil')?.setValue(imagen);
    }
  }

  nuevoUsuario() {
    console.log(this.formulario.value)
    const formData = new FormData();

    formData.append('username', this.formulario.get('username')?.value);
    formData.append('email',this.formulario.get('email')?.value);
    formData.append('password',this.formulario.get('password')?.value);
    formData.append('first_name',this.formulario.get('first_name')?.value);
    formData.append('last_name',this.formulario.get('last_name')?.value);
    formData.append('telefono',this.formulario.get('telefono')?.value);
    formData.append('pais',this.formulario.get('pais')?.value);
    formData.append('estado',this.formulario.get('estado')?.value);
    formData.append('ciudad',this.formulario.get('ciudad')?.value);
    formData.append('direccion',this.formulario.get('direccion')?.value);
    formData.append('foto_perfil',this.formulario.get('foto_perfil')?.value);


    this.registroUsuario.nuevoUsuario(formData).subscribe(
      (res) => {
        this.response = res;
        this.UrlImagen = `'http://localhost:8000/media/main/imagenes/usuarios/'${res.file}`;
        console.log(res);
        console.log(this.UrlImagen);
      },
      (err) => {  
        console.log(err);
      }
    );
  }
}



    //this.registroUsuario.nuevoUsuario(this.formulario.value).subscribe(data => {})
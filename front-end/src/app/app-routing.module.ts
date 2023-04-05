import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AuthGuard } from "./auth.guard";
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { CrearPostComponent } from './crear-post/crear-post.component';
import { CrearComentarioComponent } from './crear-comentario/crear-comentario.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {path: '', component:HomeComponent},

  // FORMULARIOS
  {path: 'login', component:LoginUsuarioComponent},
  {path: 'registro', component: RegistroUsuarioComponent},
  {path: 'formulario-post', component: CrearPostComponent},
  {path: 'formulario-comentario', component: CrearComentarioComponent},

  // PÁGINAS
  {path: 'perfil-personal/:id', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },
  {path: 'post/:id', component: PostComponent, canActivate: [AuthGuard] },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

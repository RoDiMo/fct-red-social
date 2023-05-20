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
import { ComentarioComponent } from './comentario/comentario.component';
import { AmigosComponent } from './amigos/amigos.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { EditarDatosPersonalesComponent } from './editar-datos-personales/editar-datos-personales.component';
import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
import { PerfilPersonalEstadisticasComponent } from './perfil-personal-estadisticas/perfil-personal-estadisticas.component';
import { PerfilOtroUsuarioComponent } from './perfil-otro-usuario/perfil-otro-usuario.component';
import { PerfilUsuarioPublicacionesComponent } from './perfil-usuario-publicaciones/perfil-usuario-publicaciones.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { ChatComponent } from './chat/chat.component';
import { AdminPostsComponent } from './admin-posts/admin-posts.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';



const routes: Routes = [
  {path: '', component:HomeComponent,canActivate: [AuthGuard]},

  // Administracion
  {path: 'admin-posts', component: AdminPostsComponent, canActivate: [AuthGuard]},
  {path: 'admin-usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard]},

  // FORMULARIOS
  {path: 'login', component:LoginUsuarioComponent},
  {path: 'registro', component: RegistroUsuarioComponent},
  {path: 'formulario-post', component: CrearPostComponent, canActivate: [AuthGuard]},
  {path: 'modifica-post/:id', component: CrearPostComponent, canActivate: [AuthGuard]},
  {path: 'modifica-comentario/:id', component: CrearComentarioComponent, canActivate: [AuthGuard]},
  {path: 'editar-datos-usuario', component: EditarDatosPersonalesComponent, canActivate: [AuthGuard]},
  {path: 'cambiar-contrasenia', component: CambiarContraseniaComponent, canActivate: [AuthGuard]},

  // PÁGINAS

  // Usuarios
  {path: 'perfil-personal', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },
  {path: 'perfil-personal-estadisticas', component: PerfilPersonalEstadisticasComponent, canActivate: [AuthGuard] },
  {path: 'amigos', component: AmigosComponent, canActivate: [AuthGuard] },
  {path: 'perfil-usuario/:id', component: PerfilOtroUsuarioComponent, canActivate: [AuthGuard] },
  {path: 'perfil-usuario-publicaciones/:id', component: PerfilUsuarioPublicacionesComponent, canActivate: [AuthGuard] },

  // Notificaciones
  {path: 'notificaciones', component: NotificacionesComponent, canActivate: [AuthGuard] },
  
  // Chat
  {path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
  
  // Detalles post
  {path: 'post/:id', component: PostComponent, canActivate: [AuthGuard] },
 
  // Cabecera
  {path: 'cabecera', component: CabeceraComponent, canActivate: [AuthGuard] },

]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

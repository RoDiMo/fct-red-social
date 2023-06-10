import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule,  } from '@angular/forms';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { TokenInterceptor } from "./token.interceptor";
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { RouterModule } from '@angular/router';
import { PostComponent } from './post/post.component';
import { CrearPostComponent } from './crear-post/crear-post.component';
import { ComentarioComponent } from './comentario/comentario.component';
import { CrearComentarioComponent } from './crear-comentario/crear-comentario.component';
import { AmigosComponent } from './amigos/amigos.component';
import { AmistadesCanceladasComponent } from './amistades-canceladas/amistades-canceladas.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { EditarDatosPersonalesComponent } from './editar-datos-personales/editar-datos-personales.component';
import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
import { PerfilPersonalEstadisticasComponent } from './perfil-personal-estadisticas/perfil-personal-estadisticas.component';
import { PerfilOtroUsuarioComponent } from './perfil-otro-usuario/perfil-otro-usuario.component';
import { PerfilUsuarioPublicacionesComponent } from './perfil-usuario-publicaciones/perfil-usuario-publicaciones.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { ContactosChatComponent } from './contactos-chat/contactos-chat.component';
import { ChatComponent } from './chat/chat.component';
import { AdminPostsComponent } from './admin-posts/admin-posts.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { ContactosChatModalComponent } from './contactos-chat-modal/contactos-chat-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetallePostModalComponent } from './detalle-post-modal/detalle-post-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginUsuarioComponent ,
    PerfilUsuarioComponent,
    RegistroUsuarioComponent,
    PostComponent,
    CrearPostComponent,
    ComentarioComponent,
    CrearComentarioComponent,
    AmigosComponent,
    AmistadesCanceladasComponent,
    NotificacionesComponent,
    EditarDatosPersonalesComponent,
    CambiarContraseniaComponent,
    PerfilPersonalEstadisticasComponent,
    PerfilOtroUsuarioComponent,
    PerfilUsuarioPublicacionesComponent,
    CabeceraComponent,
    ContactosChatComponent,
    ChatComponent,
    AdminPostsComponent,
    AdminUsuariosComponent,
    ContactosChatModalComponent,
    DetallePostModalComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,


    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA ],
})
export class AppModule { }

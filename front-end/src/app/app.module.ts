import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule,  } from '@angular/forms';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA ],
})
export class AppModule { }

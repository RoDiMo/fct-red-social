import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { TokenInterceptor } from "./token.interceptor";
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginUsuarioComponent,
    PerfilUsuarioComponent,
    RegistroUsuarioComponent
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
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

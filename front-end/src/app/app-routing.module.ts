import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'login', component:LoginUsuarioComponent},
  { path: 'perfil-personal/:id', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

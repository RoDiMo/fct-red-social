import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioComponent } from './registro-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { of } from 'rxjs';
import { PaginaPrincipalService } from '../pagina-principal.service';

describe('RegistroUsuarioComponent', () => {
  let component: RegistroUsuarioComponent;
  let fixture: ComponentFixture<RegistroUsuarioComponent>;
  let paginaPrincipalService: PaginaPrincipalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUsuarioComponent ],
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });











});

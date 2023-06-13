import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPostComponent } from './crear-post.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { of } from 'rxjs';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';


describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPostComponent,
        CabeceraComponent,
        ContactosChatComponent, ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPostComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });








});

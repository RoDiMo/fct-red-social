import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { ContactosChatComponent } from '../contactos-chat/contactos-chat.component';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        PostComponent,
        CabeceraComponent,
        ContactosChatComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,

        ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

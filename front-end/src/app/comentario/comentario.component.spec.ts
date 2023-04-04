import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarioComponent } from './comentario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ComentarioComponent', () => {
  let component: ComentarioComponent;
  let fixture: ComponentFixture<ComentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentarioComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule,

        ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

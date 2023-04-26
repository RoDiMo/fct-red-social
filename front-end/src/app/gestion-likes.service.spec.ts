import { TestBed } from '@angular/core/testing';

import { GestionLikesService } from './gestion-likes.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('GestionLikesService', () => {
  let service: GestionLikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        
  
        ],
        providers: [GestionLikesService],
    });
    service = TestBed.inject(GestionLikesService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

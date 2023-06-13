import { TestBed } from '@angular/core/testing';

import { AmigosService } from './amigos.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AmigosService', () => {
  let service: AmigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,

        ],
    });
    service = TestBed.inject(AmigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

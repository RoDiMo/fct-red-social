import { TestBed } from '@angular/core/testing';

import { GestionLikesService } from './gestion-likes.service';

describe('GestionLikesService', () => {
  let service: GestionLikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionLikesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

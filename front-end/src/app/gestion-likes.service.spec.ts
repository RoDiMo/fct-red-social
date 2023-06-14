import { TestBed } from '@angular/core/testing';

import { GestionLikesService } from './gestion-likes.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('GestionLikesService', () => {
  let service: GestionLikesService;
  let httpTestingController: HttpTestingController;

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
    httpTestingController = TestBed.inject(HttpTestingController);


  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should get posts by ID', () => {
    const id = 5;
    const dummyResponse = {
      /* ... */
    };

    service.obtenerPosts(id).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url + `?post=${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should save a like', () => {
    const like = {
      url: 'http://localhost:8000/likes/100/',
      usuario: 'http://localhost:8000/usuarios/1/',
      post: 'http://localhost:8000/posts/5/'
    };
    const dummyResponse = {
      /* ... */
    };

    service.guardarLike(like).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(like);
    req.flush(dummyResponse);
  });

  it('should delete a like', () => {
    const likeUrl = 'http://localhost:8000/likes/100/';
    const dummyResponse = {
      /* ... */
    };

    service.eliminarLike(likeUrl).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(likeUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  it('should update likes for a post', () => {
    const post = {
      /* ... */
    };
    const dummyResponse = {
      /* ... */
    };

    service.actualizarLikesPost(post).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(post);
    req.flush(dummyResponse);
  });
});

import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule
        ],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });   

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should create a new post', () => {
    const post = {
      /* ... */
    };
    const dummyResponse = {
      /* ... */
    };

    service.nuevoPost(post).subscribe(response => {
      
    });

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(post);
    req.flush(dummyResponse);
  });

  it('should modify a post', () => {
    const id = '1';
    const post = {
      /* ... */
    };
    const dummyResponse = {
      /* ... */
    };

    service.modificarPost(id, post).subscribe(response => {
    
    });

    const req = httpMock.expectOne(service.url + `${id}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(post);
    req.flush(dummyResponse);
  });

  it('should modify a post using a custom URL', () => {
    const url = 'http://localhost:8000/posts/1/';
    const post = {
      /* ... */
    };
    const dummyResponse = {
      /* ... */
    };

    service.modificarPostUrl(url, post).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(post);
    req.flush(dummyResponse);
  });

  it('should delete a post', () => {
    const id = '1';
    const dummyResponse = {
      /* ... */
    };

    service.eliminarPost(id).subscribe(response => {
     
    });

    const req = httpMock.expectOne(service.url + `${id}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });
});

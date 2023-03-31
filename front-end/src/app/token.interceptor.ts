import { Injectable } from '@angular/core';
import {
 HttpRequest,
 HttpHandler,
 HttpEvent,
 HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

 constructor() {}

 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
   const userData = JSON.parse(localStorage.getItem('userData') || '{}');
   if (userData.token) {
     request = request.clone({
       setHeaders: {
           Authorization: `Token ${userData.token}`
       }
     });
   }
   return next.handle(request);
 }
}
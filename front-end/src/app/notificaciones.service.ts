import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  public url = "http://localhost:8000/notificacionesamistad/"

  constructor(private http: HttpClient) { }


  nuevaNotificacion(notificacion: any): Observable<any> {
    return this.http.post<any>(this.url, notificacion);
  }

  obtenerNotificacionesUsuario(idUsuario: any): Observable<any> {
    return this.http.get(this.url+`?usuario_destino=${idUsuario}`)
  }

  obtenerNotificacionPorId(idNotificacion: any) : Observable<any>{
    return this.http.get(this.url+`${idNotificacion}/`)
  }

  actualizarNotificacion(idNotificacion: any, notificacion: any): Observable<any> {
    console.log(notificacion)
    return this.http.put(this.url+`${idNotificacion}/`, notificacion);
  }
}

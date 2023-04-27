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

  obtenerNotificacionesUsuarioDestino(idUsuario: any): Observable<any> {
    return this.http.get(this.url+`?usuario_destino=${idUsuario}&procesada=false`)
  }

  obtenerNotificacionesUsuarioOrigen(idUsuario: any): Observable<any> {
    return this.http.get(this.url+`?usuario_origen=${idUsuario}&procesada=false`)
  }


  obtenerNotificacionesUsuarioOrigenDestino(idUsuarioO: any, idUsuarioD: any): Observable<any> {
    return this.http.get(this.url+`?usuario_origen=${idUsuarioO}&usuario_destino=${idUsuarioD}&procesada=false`)
  }


  obtenerNotificacionPorId(idNotificacion: any) : Observable<any>{
    return this.http.get(this.url+`${idNotificacion}/`)
  }


  actualizarNotificacion(idNotificacion: any, notificacion: any): Observable<any> {
    console.log(notificacion)
    return this.http.put(this.url+`${idNotificacion}/`, notificacion);
  }
}

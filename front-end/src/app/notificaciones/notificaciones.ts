export class Notificacion{
    constructor(
        public id: string | null,
        public usuario_origen:string,
        public usuario_destino:string,
        public estado:string,
        public fecha_notificacion: Date,
        public procesada: boolean,
        public nombre_usuario: string | null,
    ){}
}
import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";

export class Amigo{
    constructor(
        public usuario_solicitante:string,
        public usuario_receptor:string,
        public fecha_creacion: Date,
    ){}
}


export class AmigosChat{
    constructor(
        public id: string,
        public datos_usuario_solicitante:PerfilUsuario,
        public datos_usuario_receptor:PerfilUsuario,
        public numMensajesNoLeidos: string = '0',

    ){}
}
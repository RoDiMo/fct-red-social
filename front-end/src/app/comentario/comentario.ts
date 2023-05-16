import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";
import { Post } from "../post/post";

export class Comentario{
    constructor(
        public id: string,
        public contenido : string,
        public post : Post,
        public usuario : PerfilUsuario,
        public fecha_creacion : Date,
        public nombre_usuario: string,
        public foto_perfil: string,

    ){}
}
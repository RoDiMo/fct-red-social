import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";
import { Post } from "../post/post";

export class Comentario{
    constructor(
        public contenido : string,
        public post : Post,
        public usuario : PerfilUsuario

    ){}
}
import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";

export class Post{
    constructor(
       public id: String,
       public titulo: String,
       public contenido: String,
       public imagen: ImageData,
       public usuario: PerfilUsuario,
       public num_likes: Number,
       public num_visitas: Number
    ){}
}
import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";

export class Post{
    constructor(
       public url:string, 
       public id: string,
       public titulo: string,
       public contenido: string,
       public imagen: ImageData,
       public usuario: PerfilUsuario,
       public num_likes: Number,
       public num_visitas: Number,
       public fecha_publicacion: Date,
    ){}
}

export class PostLike{
    constructor(
       public url:string, 
       public id: string,
       public titulo: string,
       public contenido: string,
       public imagen: ImageData,
       public usuario: PerfilUsuario,
       public num_likes: Number,
       public num_visitas: Number,
       public fecha_publicacion: Date,
       public likeDado: Boolean,
    ){}
}
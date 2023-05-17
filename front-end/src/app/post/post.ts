import { PerfilUsuario } from "../perfil-usuario/perfil-usuario";

export class Post{
    constructor(
        public url:string, 
        public id: string,
        public titulo: string,
        public contenido: string,
        public imagen: ImageData,
        public usuario: string,
        public num_likes: Number,
        public num_visitas: number,
        public num_comentarios: number,
        public fecha_publicacion: Date,
        public likeDado: Boolean,
        public nombre_usuario:string,
        public foto_perfil:string,
        public creador:boolean,
    ){}
}
/*
export class PostLike{
    constructor(
       public url:string, 
       public id: string,
       public titulo: string,
       public contenido: string,
       public imagen: ImageData,
       public usuario: string,
       public num_likes: Number,
       public num_visitas: number,
       public fecha_publicacion: Date,
       public likeDado: Boolean,
       public nombre_usuario:string,
       public foto_perfil:string,
       public creador:boolean,
    ){}
}

*/
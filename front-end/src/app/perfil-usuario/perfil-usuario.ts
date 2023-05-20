export class PerfilUsuario{

    constructor(
        public id :string,
        public username :string,
        public password :string,
        public first_name :string,
        public last_name :string,
        public  email :string,
        public  telefono :string,
        public es_moderador: boolean,
        public  is_staff :boolean,
        public  pais :string,
        public  estado :string,
        public  ciudad :string,
        public  direccion :string,
        public foto_perfil : any,
        public url: string,
        public amistadPendiente: boolean,
        public fecha_alta: Date,
     )
        {}

}
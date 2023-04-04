export class PerfilUsuario{

    constructor(
        public id :string,
        public username :string,
        public password :string,
        public first_name :string,
        public last_name :string,
        public  email :string,
        public  telefono :string,
        public  is_staff :boolean,
        public  pais :string,
        public  estado :string,
        public  ciudad :string,
        public  direccion :string,
        public imagen : ImageData,
     )
        {}

}
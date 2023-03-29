export class Usuarios{
    constructor(
        public url: string,
        public id: number,
        public username:string,
        public password:string,
        public first_name:string,
        public last_name:string,
        public telefono:string,
        public is_staff:boolean,
        public pais:string,
        public estado:string,
        public ciudad:string,
        public direccion:boolean,
        public foto_perfil:string,

    ){}
    public toString = () : String => {
        return  this.username
    }
}
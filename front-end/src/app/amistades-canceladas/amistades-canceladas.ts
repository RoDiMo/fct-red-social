export class AmistadesCanceladas{
    constructor(
        public amigo_emisor:string,
        public amigo_receptor:string,
        public fecha_inicio: Date,
        public fecha_fin: Date,
    ){}
}
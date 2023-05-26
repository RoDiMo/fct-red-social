
// Variable que se utiliza para almacenar la url del servidor de la API local y de desplieuge
export function url(): string {
    let LOC = "http://localhost:8000/"
    let DESP = "http://34.195.27.120:9001/"
    return LOC;
}

export function camposUsuarios(): any {
    const campos = {
        'username': 'Usuario',
        'first_name': 'Nombre Completo',
        'email': 'Email',
        'pais': 'Pais',
        'estado': 'Estado',
        'es_moderador': 'Nombre Completo',
        'fecha_alta': 'Fecha de Alta',

    }

    return campos
}
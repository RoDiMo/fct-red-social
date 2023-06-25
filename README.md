# fct-red-social

Proyecto de fin de grado para el **Ciclo Formativo de Desarrollo de Aplicaciones Web** en el insituto **I.E.S Polígono Sur**

# 1. Arquitectura
* **Base de datos:** Postgres
* **Front-end:** Angular 15
* **Back-end:** Django 4.1.7
  * API: Django Rest Framework 3.14
    
### Modelo entidad relacion

<img width="661" alt="Diagrama Entidad-Relación" src="https://github.com/RoDiMo/fct-red-social/assets/92437534/fc586951-51bf-4830-91d9-5af756245484">

### Despliegue
El despliegue se realizó en dos instancias de **Amazon Web Services**, una instancia para el **front-end** y otra para el **back-end**. Cada instancias están desplegadas en un servidor **Apache**

<img src="https://github.com/RoDiMo/fct-red-social/assets/92437534/d6a8a85c-f166-4481-92e0-a76035060dcc" alt="Descripción de la imagen" width="500" />


# 2. Funcionalidades
Las funcionalidades de la aplicación son las siguientes:

* Login y Registro de usuario
  * Validación en todos los formularios 
* Publicación y edición de posts (Texto - Imagen)
* Creación y edición de comentarios para los posts
* Gestión de likes, número de visitas y número de comentarios
* Gestión de tu perfil y estadísticas personales
* Gestión de amistades
  * Envío de solicitudes de Amistad
    * El usuario podrá aceptar o rechazar dichas solicitudes
  * Eliminar amistad
  * Buscar usuarios
* Página de administración
  * Administración de Post
    * Fitrado y ordenamiento de los datos de los posts
    * Permite ocultar y mostrar los Posts
  * Administración de Usuarios
    * Filtrado y ordenamiento de los datos de los usuarios
    * Permite dar y quitar privilegios de moderador   
* Chat en tiempo real entre amigos


# 3. Imágenes de ejemplo

| Página Principal | Perfil Personal | Amigos |
|---|---|---|
![Página Principal](https://github.com/RoDiMo/fct-red-social/assets/92437534/a8c78248-8855-43e4-bc4d-d65655bab3c5)| ![Perfil Personal ](https://github.com/RoDiMo/fct-red-social/assets/92437534/e0d4c502-938d-429d-bfa6-7e90d6b90350) | ![Amigos](https://github.com/RoDiMo/fct-red-social/assets/92437534/29b57029-dcc8-47c8-b697-e0247a643741) | 

| Administración | Pantalla móvil | Chat |
|---|---|---|
![Administración](https://github.com/RoDiMo/fct-red-social/assets/92437534/4a99ddee-ef02-496d-a0e7-4a0f4e93aea3) | ![Pantalla móvil](https://github.com/RoDiMo/fct-red-social/assets/92437534/49cde20f-ddd6-4098-bcf9-78d2868e796d) | ![Chat](https://github.com/RoDiMo/fct-red-social/assets/92437534/da9a9cfa-53f6-4648-93a8-c4b3e6d56595) |

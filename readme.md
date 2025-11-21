# Proyecto Desarrollo Web - Grupo 02

## Integrantes

    - Leandro Pereira
    - Mauricio Segovia
    - Alejandro Hernandez

## Instalacion y Ejecucion

Despues de clonar el repositorio

### Variables de entorno

Crear un archivo **.env** en la raiz del proyecto, en base al archivo **.env.example**

### Instalamos dependencias:

En terminal ejecutamos el siguiente comando

- **npm install**

### Levantamos el servidor

Luego en terminal, ejecutamos el siguiente comando

- **npm run dev**

## Levantar la base de datos de PostgreSQL con Docker

Necesitamos tener Docker instalado. Después, se debe ejecutar el comando **docker compose up** en la raíz del proyecto.
Esto iniciará la base de datos en el host y el puerto especificados en el **.env**

El MER de la base de datos se encuentra en [bd/services_mer_diagram.png](./bd/services_mer_diagram.png)

## Documentación de la API

Para acceder a la documentación de la API, ingresa a [http://localhost:3000/docs](http://localhost:3000/docs) en tu navegador

## Usuarios de ejemplo

Puedes ingresar con las siguientes credenciales en el sistema:

- Rol **ADMIN**: `admin@superservice.uy` / `contraseña`
- Rol **SELLER**: `marcos.gonzalez@gmail.com` / `contraseña`

## Pasos para generar la APK

1. Ejecutar **npm run build**. Esto ejecuta los comandos **ng build && npx cap sync**.
2. Acceder desde Android Studio a la carpeta [./front/android](./front/android/).
3. Conectar un dispositivo con depuración e instalación vía USB habilitada.
4. Presionar sobre el botón **Play** y aceptar la conexión en el celular.

## Historias de Usuario

Las historias de usuario están en la carpeta [user-stories](./user-stories). Las que pertenecen al MVP aparecen identificadas en el título de cada historia de usuario.

# Usa una imagen base de Node.js 18.18.0
FROM node:18.18.0

# Instala las herramientas necesarias para compilar bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

# Instala node-gyp globalmente
RUN npm install --global node-gyp    

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia el directorio Backend al directorio de trabajo en la imagen Docker
COPY ./Backend .

# Establece el directorio de trabajo en /usr/src/app/Backend
WORKDIR /usr/src/app

# Instala las dependencias de Nest.js
RUN npm install

# Reconstruye el módulo bcrypt para la arquitectura de la imagen Docker
RUN npm rebuild bcrypt --build-from-source

# Vuelve al directorio de trabajo principal
WORKDIR /usr/src/app

# Expone el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]


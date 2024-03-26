export const jwtConstants = {
    secret: "" + process.env.JWT_SECRET + "",//Por alguna razon, si no se hace esa concatenacion no resuelve la variable de entorno
};
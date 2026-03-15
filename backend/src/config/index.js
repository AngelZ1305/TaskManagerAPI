const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta_cambiala";
const CORS_ORIGIN = "http://localhost:5500";

module.exports = {
  PORT,
  JWT_SECRET,
  CORS_ORIGIN
};

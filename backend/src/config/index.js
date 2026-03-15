const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "";
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  PORT,
  JWT_SECRET,
  CORS_ORIGIN,
  IS_PRODUCTION
};

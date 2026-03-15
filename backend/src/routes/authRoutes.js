const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createAuthRouter({ users, jwtSecret }) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }

    const user = users.find((candidate) => candidate.email === email);

    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    return res.json({
      message: "Login correcto",
      user: {
        id: user.id,
        email: user.email
      }
    });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "SesiÃ³n cerrada" });
  });

  return router;
}

module.exports = createAuthRouter;

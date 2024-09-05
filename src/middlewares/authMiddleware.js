import jwt from "jsonwebtoken";

export const AuthAccess = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token)
      return res.status(404).json({ erro: "Token não foi fornecido" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken;
    return next();
  } catch (error) {
    return res.json({
      error: "Erro ao verificar token",
      message: error.message,
    });
  }
};

import { prisma } from "../connection/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const clientExist = await prisma.client.findFirst({
      where: {
        email,
      },
    });

    if (clientExist) return res.status(400).json({ erro: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return res.json(client);
  } catch (error) {
    return res.json({
      error: "Erro ao registrar usuário",
      message: error,
    });
  }
};

export const singInClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const clientExist = await prisma.client.findFirst({
      where: {
        email,
      },
    });

    if (!clientExist) return res.json({ erro: "Credenciais inválidas" });

    const isValidPassword = await bcrypt.compare(
      password,
      clientExist.password
    );

    if (!isValidPassword) return res.json({ erro: "Credenciais inválidas" });

    const token = jwt.sign(
      {
        id: clientExist.id,
        name: clientExist.name,
        email: clientExist.email,
      },
      process.env.JWT_SECRET
    );

    return res.json(token);
  } catch (error) {
    return res.json({
      error: "Erro ao logar usuário",
      message: error,
    });
  }
};

export const ReadClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!client) return res.status(404).json({ erro: 'Usuário inexistente' });

    return res.status(200).json(client)
  } catch (error) {
    return res.status(400).json({
      error: "Erro ao listar Cliente",
      message: error.message,
    });
  }
};

export const StripeClient = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return res.status(200).json(clients)
  } catch (error) {
    return res.status(400).json({
      error: "Erro ao listar Cliente",
      message: error.message,
    });
  }
};

export const UpdateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const isClient = await prisma.client.findUnique({
      where: {
        id,
      }
    });

    if (!isClient) return res.status(404).json({ erro: 'Usuário inexistente' });

    const updatedClient = await prisma.client.update({
      where: {
        id,
      },
      data: {
        name,
        password
      }
    });

    return res.status(200).json(updatedClient);
  } catch (error) {
    return res.status(400).json({
      error: "Erro ao listar Cliente",
      message: error.message,
    });
  }
};

export const DeleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const isClient = await prisma.client.findUnique({
      where: {
        id,
      }
    });

    if (!isClient) return res.status(404).json({ erro: 'Usuário inexistente' });

    await prisma.client.delete({
      where: {
        id,
      }
    })

    return res.status(200).json({ deleted: 'Usuário deletado com sucesso' })
  } catch (error) {
    return res.status(400).json({
      error: "Erro ao listar Cliente",
      message: error.message,
    });
  }
};

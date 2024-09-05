import { prisma } from "../connection/prisma.js";

export const CreateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const findProduct = await prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (findProduct)
      return res.status(401).json({ error: "Nome de produto já existente" });

    const storeProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });

    return res.status(200).json(storeProduct);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar produto",
      message: error.message,
    });
  }
};
export const ReadProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const showProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!showProduct) return res.status(404).json({ erro: 'Produto inexistente' })

    return res.status(200).json(showProduct);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao listar produto",
      message: error.message,
    });
  }
};
export const StripeProduct = async (req, res) => {
  try {
    const indexProduct = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!indexProduct)
      return res.status(404).json({ error: "Produtos inexistentes" });

    return res.status(200).json(indexProduct);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar produto",
      message: error.message,
    });
  }
};

export const StripeProductOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const indexProduct = await prisma.product.findMany({
      where: {
        orderId: id
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
      },
    });

    if (!indexProduct)
      return res.status(404).json({ error: "Produtos inexistentes" });

    return res.status(200).json(indexProduct);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar produto",
      message: error.message,
    });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const findProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!findProduct)
      return res.status(404).json({ error: "Produto inexistente" });

    const updateProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
      },
    });

    return res.status(200).json(updateProduct);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar produto",
      message: error.message,
    });
  }
};
export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!findProduct)
      return res.status(404).json({ error: "Produto inexistente" });

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json("Produto deletado com sucesso");
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar produto",
      message: error.message,
    });
  }
};

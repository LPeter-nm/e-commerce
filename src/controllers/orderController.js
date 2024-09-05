import { prisma } from "../connection/prisma.js";

export const CreateOrder = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { products } = req.body;

    const productsByDatabase = await prisma.product.findMany({
      where: { id: { in: products.map(p => p.product) } },

    });

    if (productsByDatabase.length === 0) {
      return res.status(404).json({ message: 'Produto inexistente!' });
    }

    const storeOrder = await prisma.order.create({
      data: {
        clientId: clientId,
        productOrders: {
          create: productsByDatabase.map(product => ({
            productId: product.id,
            amount: products.find(p => p.product === product.id)?.amount || 0
          }))
        },
      },
      include: {
        productOrders: {
          select: {
            id: true,
            amount: true
          }
        },
        client: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(200).json(storeOrder);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar Pedido",
      message: error.message,
    });
  }
};
export const ReadOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const showOrder = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        productOrders: {
          select: {
            product: {
              select: {
                id: true,
                name: true
              }
            },
            amount: true
          }
        },
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!showOrder) return res.status(404).json({ erro: 'Pedido inexistente' })

    return res.status(200).json(showOrder);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao listar Pedido",
      message: error.message,
    });
  }
};
export const StripeOrder = async (req, res) => {
  try {
    const indexOrder = await prisma.order.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        productOrders: {
          select: {
            id: true,
            amount: true
          }
        }
      }
    });

    if (!indexOrder)
      return res.status(404).json({ error: "Pedidos inexistentes" });

    return res.status(200).json(indexOrder);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar Pedido",
      message: error.message,
    });
  }
};


export const UpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { client, products } = req.body;

    const findOrder = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!findOrder)
      return res.status(404).json({ error: "Pedido inexistente" });

    const productsByDatabase = await prisma.product.findMany({
      where: { id: { in: products.map(p => p.product) } },

    });

    if (productsByDatabase.length === 0) {
      return res.status(404).json({ message: 'Produto inexistente!' });
    }



    const updateOrder = await prisma.order.update({
      where: { id: id },
      data: {
        client,
        productOrders: {
          deleteMany: {},
          create: productsByDatabase.map(product => ({
            productId: product.id,
            amount: products.find(p => p.product === product.id)?.amount || 0
          }))
        },
      },
      include: {
        productOrders: {
          select: {
            id: true,
            amount: true
          }
        },
        client: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(200).json(updateOrder);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar Pedido",
      message: error.message,
    });
  }
};
export const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const findOrder = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!findOrder)
      return res.status(404).json({ error: "Pedido inexistente" });

    await prisma.order.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ deleted: "Pedido deletado com sucesso" });
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar Pedido",
      message: error.message,
    });
  }
};

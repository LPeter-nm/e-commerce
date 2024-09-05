import { Router } from "express";
import { CreateOrder, DeleteOrder, ReadOrder, StripeOrder, UpdateOrder } from "../controllers/orderController.js";
import { AuthAccess } from "../middlewares/authMiddleware.js";

const route = Router();

route.get('/pedidos', AuthAccess, StripeOrder);
route.post('/pedido/:clientId', AuthAccess, CreateOrder);
route.get('/pedido/:id', AuthAccess, ReadOrder);
route.put('/pedido/:id', AuthAccess, UpdateOrder);
route.delete('/pedido/:id', AuthAccess, DeleteOrder);

export { route as RouterOrder };
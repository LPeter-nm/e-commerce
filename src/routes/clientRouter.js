import { Router } from "express";
import { DeleteClient, ReadClient, registerClient, singInClient, StripeClient, UpdateClient } from "../controllers/clientController.js";
import { AuthAccess } from "../middlewares/authMiddleware.js";


const route = Router();

route.get('/clientes', AuthAccess, StripeClient);
route.post('/register', registerClient);
route.post('/login', singInClient);
route.get('/cliente/:id', AuthAccess, ReadClient);
route.put('/cliente/:id', AuthAccess, UpdateClient);
route.delete('/cliente/:id', AuthAccess, DeleteClient);

export { route as RouterClient }

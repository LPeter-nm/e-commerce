import { Router } from "express";
import {
  CreateProduct,
  DeleteProduct,
  ReadProduct,
  StripeProduct,
  StripeProductOrder,
  UpdateProduct,
} from "../controllers/productController.js";
import { AuthAccess } from "../middlewares/authMiddleware.js";

const route = Router();

route.get("/produtos", AuthAccess, StripeProduct);
route.get("/produtos/:productId", AuthAccess, StripeProductOrder)
route.post("/produto", AuthAccess, CreateProduct);
route.get("/produto/:id", AuthAccess, ReadProduct);
route.put("/produto/:id", AuthAccess, UpdateProduct);
route.delete("/produto/:id", AuthAccess, DeleteProduct);

export { route as RouterProduct };

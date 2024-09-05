import express from "express";
import { RouterProduct } from "./routes/productRouter.js";
import { RouterClient } from "./routes/clientRouter.js";
import { RouterOrder } from "./routes/orderRouter.js";

const app = express();
app.use(express.json());

app.use(RouterProduct);
app.use(RouterClient);
app.use(RouterOrder);

app.listen(4000, () => console.log("Server running..."));

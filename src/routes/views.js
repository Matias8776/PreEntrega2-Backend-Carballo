import ProductManager from "../dao/mongoDb/ProductManager.js";
import CartManager from "../dao/mongoDb/CartManager.js";
import { Router } from "express";
import __dirname from "../utils.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const disponibility = req.query.disponibility;
    let sort = req.query.sort;

    if (sort === "asc") {
        sort = 1;
    } else if (sort === "desc") {
        sort = -1;
    }

    const products = await productManager.getProducts(
        limit || 10,
        page || 1,
        category,
        disponibility,
        sort
    );

    const plainProducts = products.docs.map((doc) => doc.toObject());
    res.render("home", {
        plainProducts,
        style: "home.css",
        title: "Ecommerce - Productos",
    });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        style: "realTimeProducts.css",
        title: "Ecommerce - Productos en tiempo real",
    });
});

router.get("/chat", (req, res) => {
    res.render("chat", {
        style: "chat.css",
        title: "Ecommerce - Chat",
    });
});

router.get("/products", async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const disponibility = req.query.disponibility;
    let sort = req.query.sort;

    if (sort === "asc") {
        sort = 1;
    } else if (sort === "desc") {
        sort = -1;
    }

    const products = await productManager.getProducts(
        limit || 10,
        page || 1,
        category,
        disponibility,
        sort
    );

    if (products.totalPages < page) {
        res.render("404", { style: "404.css", title: "Ecommerce - 404" });
        return;
    }

    const plainProducts = products.docs.map((doc) => doc.toObject());
    res.render("products", {
        products,
        plainProducts,
        style: "products.css",
        title: "Ecommerce - Productos",
    });
});

router.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const plainProduct = await productManager.getProductById(pid);

    res.render("product", {
        plainProduct,
        style: "product.css",
        title: `Ecommerce - ${plainProduct.title}`,
    });
});

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    const plainProducts = cart.products;
    res.render("carts", {
        plainProducts,
        style: "carts.css",
        title: "Ecommerce - Carrito",
    });
});

export default router;

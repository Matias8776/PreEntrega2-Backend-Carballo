import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import path from "path";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MessagesManager from "./dao/mongoDb/MessageManager.js";

const messagesManager = new MessagesManager();

const PORT = process.env.PORT || 8080;
const app = express();
const connection = await mongoose.connect(
    "mongodb+srv://Matty:zzz456@socketsdb.n3ygexn.mongodb.net/ecommerce"
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "/public")));
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });

    socket.emit("server:updatedProducts");
    socket.on("client:updateProduct", () => {
        io.emit("server:updatedProducts");
    });

    socket.on("nuevousuario", async (usuario) => {
        socket.broadcast.emit("broadcast", usuario);
        socket.emit("chat", await messagesManager.getMessages());
    });
    socket.on("mensaje", async (info) => {
        await messagesManager.createMessage(info);
        io.emit("chat", await messagesManager.getMessages());
    });
});

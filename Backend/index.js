const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "pio.env") });
console.log("MYSQL_HOST:", process.env.MYSQL_HOST);

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const { realizarQuery } = require("./modulos/mysql");

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGENES = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({ origin: ORIGENES, credentials: true }));
app.use(express.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: ORIGENES,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

let contador = 0;

io.on("connection", (socket) => {
  const req = socket.request;

  socket.on("joinRoom", (data) => {
    if (req.session.room != undefined && req.session.room.length > 0) {
      socket.leave(req.session.room);
    }
    req.session.room = data.room;
    socket.join(req.session.room);

    io.to(req.session.room).emit("chat-messages", {
      user: req.session.user,
      room: req.session.room,
    });
  });

  socket.on("pingAll", (data) => {
    console.log("PING ALL:", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
      room: req.session.room,
      message: data.message,
    });
  });

  socket.on("eventoPersonalizado", () => {
    contador++;
    socket.emit("respuestaPersonalizada", { contador });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

app.post("/register", async function (req, res) {
  try {
    const { mail, contrasena } = req.body;

    if (!mail || !contrasena) {
      return res.status(400).send({ res: "Todos los campos son obligatorios" });
    }

    const existente = await realizarQuery(
      "SELECT mail FROM Clientes WHERE mail = ?",
      [mail]
    );
    if (existente.length > 0) {
      return res.status(409).send({ res: "Ya existe este usuario" });
    }

    await realizarQuery(
      "INSERT INTO Clientes (mail, contrasena) VALUES (?, ?)",
      [mail, contrasena]
    );
    res.send({ res: "Usuario agregado" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/login", async function (req, res) {
  try {
    const { mail, contrasena } = req.body;

    if (!mail || !contrasena) {
      return res.status(400).send({ res: "No pueden haber campos vacíos" });
    }

    const usuario = await realizarQuery(
      "SELECT mail FROM Clientes WHERE mail = ? AND contrasena = ?",
      [mail, contrasena]
    );

    if (usuario.length > 0) {
      req.session.user = usuario[0].mail;
      res.send({ res: "Login correcto" });
    } else {
      res.status(401).send({ res: "Mail o contraseña incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/logout", function (req, res) {
  req.session.destroy(() => res.send({ res: "Sesión cerrada" }));
});



app.get("/productos", async function (req, res) {
  try {
    const productos = await realizarQuery("SELECT * FROM Productos");

    res.send(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/perfil", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }


    const usuario = await realizarQuery(
      "SELECT mail, saldo FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    if (usuario.length === 0) {
      return res.status(404).send({ res: "Usuario no encontrado" });
    }


    const pedidos = await realizarQuery(
      "SELECT * FROM Pedidos WHERE id_cliente = ? AND estado != 'entregado'",
      [req.session.user]
    );

    res.send({
      usuario: usuario[0],
      pedidosActivos: pedidos
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});


app.get("/saldo", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const resultado = await realizarQuery(
      "SELECT saldo FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    if (resultado.length === 0) {
      return res.status(404).send({ res: "Usuario no encontrado" });
    }

    res.send({ saldo: resultado[0].saldo });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/cargar-saldo", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const monto = Number(req.body.monto);

    if (!monto || monto <= 0) {
      return res.status(400).send({ res: "El monto debe ser mayor a 0" });
    }

    const saldoActual = await realizarQuery(
      "SELECT saldo FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    if (saldoActual.length === 0) {
      return res.status(404).send({ res: "Usuario no encontrado" });
    }

    await realizarQuery(
      "UPDATE Clientes SET saldo = saldo + ? WHERE mail = ?",
      [monto, req.session.user]
    );

    res.send({ res: "Saldo cargado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/carrito", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const carrito = req.session.carrito || {};
    const ids = Object.keys(carrito).map(Number).filter(Number.isInteger);

    if (ids.length === 0) {
      return res.send({ productos: [], total: 0 });
    }

    const marcas = ids.map(() => "?").join(",");

    const resultado = await realizarQuery(
      "SELECT id_producto, nombre, precio, stock, descripcion, imagen FROM Productos WHERE id_producto IN (" + marcas + ")",
      ids
    );

    const productos = resultado.map((p) => ({
      id_producto: p.id_producto,
      nombre: p.nombre,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.descripcion,
      imagen: p.imagen,
      cantidad: carrito[p.id_producto],
    }));

    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    res.send({ productos, total });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.delete("/quitar-carrito/:id_producto", function (req, res) {
  if (!req.session.user) {
    return res.status(401).send({ res: "No hay sesión activa" });
  }

  const id_producto = req.params.id_producto;

  if (req.session.carrito && req.session.carrito[id_producto]) {
    delete req.session.carrito[id_producto];
  }

  res.send({ res: "Producto eliminado del carrito" });
});

app.get("/sanguches", async function (req, res) {
  try {
    const productos = await realizarQuery(
      "SELECT * FROM Productos WHERE categoria = 'Sanguches'"
    );

    res.send(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/confirmar-pedido", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const carrito = req.session.carrito || {};
    const ids = Object.keys(carrito);

    if (ids.length === 0) {
      return res.status(400).send({ res: "El carrito está vacío" });
    }

    const cliente = await realizarQuery(
      "SELECT id_cliente, saldo FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    let total = 0;
    for (const id of ids) {
      const producto = await realizarQuery(
        "SELECT precio FROM Productos WHERE id_producto = ?",
        [id]
      );
      total += producto[0].precio * carrito[id];
    }

    if (Number(cliente[0].saldo) < total) {
      return res.status(400).send({ res: "Saldo insuficiente" });
    }


    const pedido = await realizarQuery(
      "INSERT INTO Pedidos (id_cliente, horario, total, estado) VALUES (?, CURTIME(), ?, 'En Preparacion')",
      [cliente[0].id_cliente, total]
    );

    for (const id of ids) {
      await realizarQuery(
        "INSERT INTO DetallePedido (id_pedido, id_producto, cantidad) VALUES (?, ?, ?)",
        [pedido.insertId, id, carrito[id]]
      );
    }

    await realizarQuery(
      "UPDATE Clientes SET saldo = saldo - ? WHERE id_cliente = ?",
      [total, cliente[0].id_cliente]
    );

    req.session.carrito = {};

    res.send({ res: "¡Pedido confirmado!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/hamburguesas", async function (req, res) {
  try {
    const productos = await realizarQuery(
      "SELECT * FROM Productos WHERE categoria = 'Hamburguesas'"
    );

    res.send(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/snacks", async function (req, res) {
  try {
    const productos = await realizarQuery(
      "SELECT * FROM Productos WHERE categoria = 'Snacks'"
    );

    res.send(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/bebidas", async function (req, res) {
  try {
    const productos = await realizarQuery(
      "SELECT * FROM Productos WHERE categoria = 'Bebidas'"
    );

    res.send(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/agregar-carrito", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const { id_producto } = req.body;

    const resultado = await realizarQuery(
      "SELECT stock FROM Productos WHERE id_producto = ?",
      [id_producto]
    );

    if (resultado.length === 0) {
      return res.status(404).send({ res: "El producto no existe" });
    }

    if (!req.session.carrito) {
      req.session.carrito = {};
    }

    const cantidadActual = req.session.carrito[id_producto] || 0;

    if (cantidadActual + 1 > resultado[0].stock) {
      return res.status(400).send({ res: "No hay más stock disponible" });
    }

    req.session.carrito[id_producto] = cantidadActual + 1;

    res.send({ res: "Producto agregado al carrito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});
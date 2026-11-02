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
const TIEMPOS = {
  Hamburguesas: 5,
  Sanguches: 4,
  Snacks: 2,
  Bebidas: 1,
};
const SEGUNDOS_RETIRO = 20;

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
  if (req.session.user) {
    socket.join("cliente_" + req.session.user);
  }

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

    const marcas = ids.map(() => "?").join(",");

    const productos = await realizarQuery(
      "SELECT id_producto, precio, categoria FROM Productos WHERE id_producto IN (" + marcas + ")",
      ids
    );

    if (productos.length === 0) {
      return res.status(400).send({ res: "El carrito está vacío" });
    }

    let total = 0;
    let segundos = 0;

    productos.forEach(function (p) {
      total += p.precio * carrito[p.id_producto];

      const tiempo = TIEMPOS[p.categoria] || 5;
      if (tiempo > segundos) {
        segundos = tiempo;
      }
    });

    if (Number(cliente[0].saldo) < total) {
      return res.status(400).send({ res: "Saldo insuficiente" });
    }

    const pedido = await realizarQuery(
      "INSERT INTO Pedidos (id_cliente, horario, total, estado) VALUES (?, CURTIME(), ?, 'En Preparacion')",
      [cliente[0].id_cliente, total]
    );

    const filas = productos
      .map((p) => "(" + pedido.insertId + ", " + p.id_producto + ", " + carrito[p.id_producto] + ")")
      .join(",");

    await realizarQuery(
      "INSERT INTO DetallePedido (id_pedido, id_producto, cantidad) VALUES " + filas
    );

    await realizarQuery(
      "UPDATE Clientes SET saldo = saldo - ? WHERE id_cliente = ?",
      [total, cliente[0].id_cliente]
    );

    req.session.carrito = {};

    const id_pedido = pedido.insertId;
    const id_cliente = cliente[0].id_cliente;
    const mail = req.session.user;

    setTimeout(async function () {
      try {
        await realizarQuery(
          "UPDATE Pedidos SET estado = 'Listo' WHERE id_pedido = ?",
          [id_pedido]
        );

        const mensaje = "Tu pedido #" + id_pedido + " está listo";

        const alerta = await realizarQuery(
          "INSERT INTO Alerta (id_cliente, id_pedido, mensaje) VALUES (?, ?, ?)",
          [id_cliente, id_pedido, mensaje]
        );

        io.to("cliente_" + mail).emit("pedidoListo", {
          id_alerta: alerta.insertId,
          id_pedido: id_pedido,
          mensaje: mensaje,
        });

        console.log("Pedido " + id_pedido + " listo");
      } catch (error) {
        console.error(error);
      }
    }, segundos * 1000);

    setTimeout(async function () {
      try {
        await realizarQuery(
          "UPDATE Pedidos SET estado = 'Entregado' WHERE id_pedido = ?",
          [id_pedido]
        );

        await realizarQuery(
          "DELETE FROM Alerta WHERE id_pedido = ?",
          [id_pedido]
        );

        io.to("cliente_" + mail).emit("pedidoEntregado", {
          id_pedido: id_pedido,
        });

        console.log("Pedido " + id_pedido + " entregado");
      } catch (error) {
        console.error(error);
      }
    }, (segundos + SEGUNDOS_RETIRO) * 1000);
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

app.get("/rol", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ esAdmin: false });
    }

    const resultado = await realizarQuery(
      "SELECT es_admin FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    res.send({
      esAdmin: resultado.length > 0 && Boolean(resultado[0].es_admin)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ esAdmin: false });
  }
});
app.get("/mis-pedidos", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const cliente = await realizarQuery(
      "SELECT id_cliente FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    const pedidos = await realizarQuery(
      "SELECT id_pedido, horario, total, estado FROM Pedidos WHERE id_cliente = ? AND estado IN ('En Preparacion', 'Listo')",
      [cliente[0].id_cliente]
    );

    const productos = await realizarQuery(
      "SELECT DetallePedido.id_pedido, cantidad, nombre FROM DetallePedido JOIN Productos ON DetallePedido.id_producto = Productos.id_producto JOIN Pedidos ON DetallePedido.id_pedido = Pedidos.id_pedido WHERE id_cliente = ?",
      [cliente[0].id_cliente]
    );

    res.send({ pedidos, productos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.delete("/alertas/:id_alerta", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const cliente = await realizarQuery(
      "SELECT id_cliente FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    const alerta = await realizarQuery(
      "SELECT id_pedido FROM Alerta WHERE id_alerta = ? AND id_cliente = ?",
      [req.params.id_alerta, cliente[0].id_cliente]
    );

    if (alerta.length > 0) {
      await realizarQuery(
        "UPDATE Pedidos SET estado = 'Entregado' WHERE id_pedido = ?",
        [alerta[0].id_pedido]
      );
    }

    await realizarQuery(
      "DELETE FROM Alerta WHERE id_alerta = ? AND id_cliente = ?",
      [req.params.id_alerta, cliente[0].id_cliente]
    );

    res.send({ res: "Alerta descartada" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/alertas", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const cliente = await realizarQuery(
      "SELECT id_cliente FROM Clientes WHERE mail = ?",
      [req.session.user]
    );

    const alertas = await realizarQuery(
      "SELECT id_alerta, id_pedido, mensaje FROM Alerta WHERE id_cliente = ?",
      [cliente[0].id_cliente]
    );

    res.send(alertas);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});


app.post("/actualizar-cantidad", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const { id_producto, cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return res.status(400).send({ res: "Cantidad inválida" });
    }

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

    if (cantidad > resultado[0].stock) {
      return res.status(400).send({ res: "No hay suficiente stock disponible" });
    }

    req.session.carrito[id_producto] = cantidad;

    res.send({ res: "Cantidad actualizada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});


app.get("/productos-admin", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const resultado = await realizarQuery(
      "SELECT * FROM Productos"
    );

    res.send({ productos: resultado });

  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/modificar-stock", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "No hay sesión activa" });
    }

    const { id_producto, cantidad } = req.body;

    const resultado = await realizarQuery(
      "SELECT stock FROM Productos WHERE id_producto = ?",
      [id_producto]
    );

    if (resultado.length === 0) {
      return res.status(404).send({ res: "El producto no existe" });
    }

    const nuevoStock = resultado[0].stock + cantidad;

    if (nuevoStock < 0) {
      return res.status(400).send({ res: "No hay suficiente stock" });
    }

    await realizarQuery(
      "UPDATE Productos SET stock = ? WHERE id_producto = ?",
      [nuevoStock, id_producto]
    );

    res.send({ res: "Stock actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});
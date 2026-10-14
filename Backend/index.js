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
      return res.send({ res: "Todos los campos son obligatorios" });
    }

    const existente = await realizarQuery(
      "SELECT mail FROM Clientes WHERE mail = ?",
      [mail]
    );
    if (existente.length > 0) {
      return res.send({ res: "Ya existe este usuario" });
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
      return res.send({ res: "No pueden haber campos vacíos" });
    }

    const usuario = await realizarQuery(
      "SELECT mail,contrasena FROM Clientes WHERE mail = ? AND contrasena = ?",
      [mail, contrasena]
    );

    if (usuario.length > 0) {
      req.session.user = usuario[0].mail;
      res.send({ res: "Login correcto", usuario: usuario[0] });
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

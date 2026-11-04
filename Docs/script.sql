SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS DetallePedido;
DROP TABLE IF EXISTS Alerta;
DROP TABLE IF EXISTS Pedidos;
DROP TABLE IF EXISTS Saldo;
DROP TABLE IF EXISTS Productos;
DROP TABLE IF EXISTS Clientes;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT,
    mail VARCHAR(100),
    contrasena VARCHAR(100),
    es_admin BOOL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id_cliente)
);

CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT,
    nombre VARCHAR(100),
    categoria VARCHAR(100),
    precio INT,
    stock INT,
    descripcion VARCHAR(100),
    imagen VARCHAR(100),
    PRIMARY KEY (id_producto)
);

CREATE TABLE Saldo (
    id_saldo INT AUTO_INCREMENT,
    id_cliente INT,
    metodo_pago VARCHAR(100),
    cantidad_saldo BIGINT,
    PRIMARY KEY (id_saldo),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT,
    id_cliente INT,
    horario TIME,
    total INT,
    estado VARCHAR(100),
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

CREATE TABLE DetallePedido (
    id_detalle INT AUTO_INCREMENT,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    PRIMARY KEY (id_detalle),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

CREATE TABLE Alerta (
    id_alerta INT AUTO_INCREMENT,
    id_cliente INT,
    id_pedido INT,
    mensaje VARCHAR(500),
    PRIMARY KEY (id_alerta),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
);

INSERT INTO Clientes(mail, contrasena, es_admin) VALUES 
    ('a@pioix.edu.ar', '123', TRUE),
    ('p@pioix.edu.ar', '123', FALSE);

INSERT INTO Pedidos (id_cliente, horario, total, estado) VALUES 
    (1, '10:10:00', 1500, 'Finalizado'),
    (2, '08:40:00', 2000, 'En Preparacion');

INSERT INTO Saldo (id_cliente, metodo_pago, cantidad_saldo) VALUES 
    (1, 'Mercado Pago', 20000),
    (2, 'Efectivo', 100);
    
INSERT INTO Productos (nombre, categoria, precio, stock, descripcion, imagen) VALUES
    ('Sánguche Queso', 'Sanguches', 5000, 50, 'Queso', 'sanguchequeso.png'),
    ('Sánguche Jamón y Queso', 'Sanguches', 6000, 50, 'Jamon y Queso', 'sanguchejamonyqueso.png'),
    ('Sánguche Salame y Queso', 'Sanguches', 6500, 50, 'Salame y Queso', 'sanguchesalameyqueso.png'),
    ('Sánguche Lechuga y Tomate', 'Sanguches', 5500, 50, 'Lechuga y Tomate', 'sanguchelechugaytomate.png'),
    ('Hamburguesa Carne', 'Hamburguesas', 7500, 50, 'Carne', 'hamburguesacarne.png'),
    ('Hamburguesa Queso', 'Hamburguesas', 8500, 50, 'Carne, queso', 'hamburguesaqueso.png'),
    ('Hamburguesa Completa', 'Hamburguesas', 12500, 50, 'Carne, queso, huevo, panceta', 'hamburguesaquesohuevopanceta.png'),
    ('Hamburguesa Especial', 'Hamburguesas', 10500, 50, 'Carne, queso, lechuga, tomate', 'hamburguesaquesolechugatomate.png'),
    ('Bolsa Papas Fritas', 'Snacks', 3500, 50, 'Papas Lays', 'bolsapapasfritas.png'),
    ('Bolsa Doritos', 'Snacks', 3500, 50, 'Doritos', 'bolsadoritos.png'),
    ('Bolsa Cheetos', 'Snacks', 3800, 50, 'Cheetos', 'bolsachetos.png'),
    ('Bolsa Takis', 'Snacks', 4800, 50, 'Takis', 'bolsatakis.png'),
    ('Agua Mineral', 'Bebidas', 2200, 50, 'Agua', 'agua.png'),
    ('Coca Cola', 'Bebidas', 2800, 50, 'Coca Cola', 'cocacola.png'),
    ('Sprite', 'Bebidas', 2800, 50, 'Sprite', 'sprite.png'),
    ('Fanta', 'Bebidas', 2800, 50, 'Fanta', 'fanta.png');

INSERT INTO Alerta(id_cliente, id_pedido, mensaje) VALUES
    (1, 1, 'Tu pedido esta listo'),
    (2, 2, 'Tu pedido esta en preparacion');

UPDATE Pedidos SET estado = 'Entregado' WHERE estado IN ('En Preparacion', 'Listo') AND id_pedido > 0;
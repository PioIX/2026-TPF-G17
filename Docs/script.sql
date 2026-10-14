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
    PRIMARY KEY (id_cliente)
);


CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT,
    nombre VARCHAR(100),
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
    cantidad_saldo INT,
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
    ('a@pioix.edu.ar', 'Admin', TRUE),
    ('p@pioix.edu.ar', 'Profes', FALSE);

INSERT INTO Pedidos (id_cliente, horario, total, estado) VALUES 
    (1, '10:10:00', 1500, 'Finalizado'),
    (2, '08:40:00', 2000, 'En Preparacion');

INSERT INTO Saldo (id_cliente, metodo_pago, cantidad_saldo) VALUES 
    (1, 'Mercado Pago', 20000),
    (2, 'Efectivo', 100);
    
INSERT INTO Pedidos(id_cliente, horario, total, estado) VALUES 
    (1, '10:10:00', 2500, 'Finalizado'),
    (2, '08:40:00', 2000, 'En Preparacion');

INSERT INTO Alerta(id_cliente, id_pedido, mensaje) VALUES
    (1, 1, 'Tu pedido esta listo'),
    (2, 2, 'Tu pedido esta en preparacion');
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Stock() {
  const [productos, setProductos] = useState([]);
  const [nuevosPrecios, setNuevosPrecios] = useState({});

  function cargarProductos() {
    fetch("http://localhost:4000/productos-admin", {
      credentials: "include"
    })
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (datos) {
        setProductos(datos.productos);
      })
      .catch(function () {
        alert("No se pudieron cargar los productos");
      });
  }

  useEffect(function () {
    cargarProductos();
  }, []);

  function modificarStock(id_producto, cantidad) {
    fetch("http://localhost:4000/modificar-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id_producto: id_producto,
        cantidad: cantidad
      })
    })
      .then(function (respuesta) {
        return respuesta.json().then(function (datos) {

          if (respuesta.ok) {
            cargarProductos();
          }
        });
      })
      .catch(function () {
        alert("No se pudo modificar el stock");
      });
  }

  function cambiarInputPrecio(id_producto, valor) {
    setNuevosPrecios(function (anteriores) {
      return { ...anteriores, [id_producto]: valor };
    });
  }

  function modificarPrecio(id_producto) {
    const precio = nuevosPrecios[id_producto];

    if (!(Number(precio) > 0)) {
      alert("Ingresá un precio mayor a 0");
      return;
    }

    fetch("http://localhost:4000/modificar-precio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id_producto: id_producto,
        precio: Number(precio)
      })
    })
      .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
          if (respuesta.ok) {
            cambiarInputPrecio(id_producto, "");
            cargarProductos();
          } else {
            alert(datos.res);
          }
        });
      })
      .catch(function () {
        alert("No se pudo modificar el precio");
      });
  }

  return (
    <main className={styles.main}>
      <title>Buffetazo - Gestión de stock</title>

      <header className={styles.header}>
        <h1 className={styles.titulo}>Gestión de stock</h1>
        <p>Administrá las cantidades y los precios de tus productos</p>
      </header>

      <Link href="/admin" className={styles.volver}>
        Volver al administrador
      </Link>

      <h2 className={styles.subtitulo}>Productos disponibles</h2>

      {productos.length === 0 ? (
        <p className={styles.vacio}>No hay productos cargados.</p>
      ) : (
        <div className={styles.lista}>
          {productos.map(function (producto) {
            return (
              <div key={producto.id_producto} className={styles.card}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className={styles.imagen}
                />

                <h3>{producto.nombre}</h3>

                <p className={styles.stock}>
                  Stock actual: {producto.stock}
                </p>

                <div className={styles.controles}>
                  <button
                    className={`${styles.btnCantidad} ${styles.btnRestar}`}
                    onClick={function () {
                      modificarStock(producto.id_producto, -1);
                    }}
                  >
                    −
                  </button>

                  <button
                    className={styles.btnCantidad}
                    onClick={function () {
                      modificarStock(producto.id_producto, 1);
                    }}
                  >
                    +
                  </button>
                </div>

                <p className={styles.precio}>
                  Precio actual: ${producto.precio}
                </p>

                <div className={styles.controlesPrecio}>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Nuevo precio"
                    value={nuevosPrecios[producto.id_producto] || ""}
                    onChange={function (e) {
                      cambiarInputPrecio(producto.id_producto, e.target.value);
                    }}
                    className={styles.inputPrecio}
                  />

                  <button
                    className={styles.btnPrecio}
                    onClick={function () {
                      modificarPrecio(producto.id_producto);
                    }}
                  >
                    Cambiar precio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
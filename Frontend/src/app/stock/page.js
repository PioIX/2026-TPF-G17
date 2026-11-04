
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Stock() {
  const [productos, setProductos] = useState([]);

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
          // alert(datos.res);

          if (respuesta.ok) {
            cargarProductos();
          }
        });
      })
      .catch(function () {
        alert("No se pudo modificar el stock");
      });
  }

  return (
    <main className={styles.main}>
      <title>Buffetazo - Gestión de stock</title>

      <header className={styles.header}>
        <h1 className={styles.titulo}>Gestión de stock</h1>
        <p>Administrá las cantidades de tus productos</p>
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
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(function () {
    fetch("http://localhost:4000/carrito", { credentials: "include" })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        if (datos.productos !== undefined) {
          setProductos(datos.productos);
          setTotal(datos.total);
        }
      });
  }, []);

  return (
    <div className={styles.contenedorPrincipal}>
      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Tu carrito</h1>
        <Link href="/home" className={styles.btnVolver}>Volver al menú</Link>
      </header>

      <main className={styles.contenidoPrincipal}>
        {productos.length === 0 ? (
          <p className={styles.vacio}>Tu carrito está vacío</p>
        ) : (
          <div>
            {productos.map(function (producto) {
              return (
                <div key={producto.id_producto} className={styles.itemCarrito}>
                  <img src={producto.imagen} alt={producto.nombre} className={styles.imagenItem} />
                  <div className={styles.infoItem}>
                    <h3 className={styles.nombreItem}>{producto.nombre}</h3>
                    <p className={styles.cantidadItem}>Cantidad: {producto.cantidad}</p>
                  </div>
                  <span className={styles.precioItem}>${producto.precio * producto.cantidad}</span>
                </div>
              );
            })}

            <div className={styles.resumen}>
              <span className={styles.totalTexto}>Total: ${total}</span>
              <button className={styles.btnConfirmar}>Confirmar pedido</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
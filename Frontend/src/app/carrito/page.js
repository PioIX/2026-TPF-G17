
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  function cargarCarrito() {
    fetch("http://localhost:4000/carrito", {
      credentials: "include"
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        if (datos.productos !== undefined) {
          setProductos(datos.productos);
          setTotal(datos.total);
        }
      });
  }

  useEffect(function () {
    cargarCarrito();
  }, []);

  function cambiarCantidad(producto, cambio) {
    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad <= 0) {
      eliminar(producto.id_producto);
      return;
    }

    fetch("http://localhost:4000/actualizar-cantidad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id_producto: producto.id_producto,
        cantidad: nuevaCantidad
      })
    })
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function () {
        cargarCarrito();
      })
      .catch(function () {
        alert("No se pudo actualizar la cantidad");
      });
  }

  function confirmar() {
    fetch("http://localhost:4000/confirmar-pedido", {
      method: "POST",
      credentials: "include",
    })
      .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
          alert(datos.res);
          if (respuesta.ok) {
            cargarCarrito();
          }
        });
      })
      .catch(function () {
        alert("No se pudo conectar con el servidor");
      });
  }

  function eliminar(id_producto) {
    fetch("http://localhost:4000/quitar-carrito/" + id_producto, {
      method: "DELETE",
      credentials: "include"
    })
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function () {
        cargarCarrito();
      });
  }

  return (
    <div className={styles.contenedorPrincipal}>
      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Tu carrito</h1>
        <Link href="/home" className={styles.btnVolver}>
          Volver al menú
        </Link>
      </header>

      <main className={styles.contenidoPrincipal}>
        {productos.length === 0 ? (
          <p className={styles.vacio}>Tu carrito está vacío</p>
        ) : (
          <div>
            {productos.map(function (producto) {
              return (
                <div key={producto.id_producto} className={styles.itemCarrito}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className={styles.imagenItem}
                  />

                  <div className={styles.infoItem}>
                    <h3 className={styles.nombreItem}>
                      {producto.nombre}
                    </h3>

                    <div className={styles.controlesCantidad}>
                      <button
                        className={styles.btnCantidad}
                        onClick={function () {
                          cambiarCantidad(producto, -1);
                        }}
                      >
                        −
                      </button>

                      <span>{producto.cantidad}</span>

                      <button
                        className={styles.btnCantidad}
                        onClick={function () {
                          cambiarCantidad(producto, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className={styles.precioItem}>
                    ${producto.precio * producto.cantidad}
                  </span>

                  <button
                    className={styles.btnEliminar}
                    onClick={function () {
                      eliminar(producto.id_producto);
                    }}
                  >
                    🗑
                  </button>
                </div>
              );
            })}

            <div className={styles.resumen}>
              <span className={styles.totalTexto}>
                Total: ${total}
              </span>

              <button
                className={styles.btnConfirmar}
                onClick={confirmar}
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

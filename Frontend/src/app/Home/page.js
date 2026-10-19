"use client";

import Logout from "@/components/Logout";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [saldo, setSaldo] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

useEffect(function () {
  fetch("http://localhost:4000/agregarCarrito", {
    method: "GET",
    credentials: "include"
  })
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (datos) {
      if (datos.pedidos !== undefined) {
        setPedidos(datos.pedidos);
      }
      setCargandoPedidos(false);
    });
}, []);

  useEffect(function () {
    fetch("http://localhost:4000/saldo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        if (datos.saldo !== undefined) {
          setSaldo(datos.saldo);
        }
      });
  }, []);

  return (
    <div className={styles.contenedorPrincipal}>
      <title>Buffetazo - Inicio</title>


      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Buffetazo</h1>

        <div className={styles.accionesHeader}>
          <div className={styles.badgeSaldo}>
            Saldo: ${saldo}
          </div>

          <Link href="/cargarSaldo" className={styles.btnCargarSaldo}>
            + Cargar Saldo
          </Link>

          <Link href="/carrito" className={styles.btnCarrito}>
            Carrito
          </Link>

          <Logout />

        </div>
      </header>
      <main className={styles.bloques}>
        <Link href="/almuerzo" className={styles.bloque}>
          <img src="/almuerzo.png" alt="Almuerzo" />
        </Link>

        <Link href="/merienda" className={styles.bloque}>
          <img src="/merienda.png" alt="Merienda" />
        </Link>

        <Link href="/bebidas" className={styles.bloque}>
          <img src="/bebidas.png" alt="Bebidas" />
        </Link>
      </main>
    
    <div className={styles.listaPedidos}>
      {pedidos.map((pedido) => (
        <article key={pedido.id_pedido} className={styles.tarjetaPedido}>
          <div className={styles.cabeceraPedido}>
            <h3 className={styles.numeroPedido}>Pedido #{pedido.id_pedido}</h3>
            <span className={`${styles.estadoPedido} ${claseEstado(pedido.estado)}`}>
              {pedido.estado}
            </span>
          </div>

          <ul className={styles.productosPedido}>
            {pedido.productos.map((producto, i) => (
              <li key={i} className={styles.itemPedido}>
                {producto.cantidad}× {producto.nombre}
              </li>
            ))}
          </ul>

          <div className={styles.piePedido}>
            <span className={styles.horarioRetiro}>
              Retirar a las <strong>{String(pedido.horario).slice(0, 5)}</strong>
            </span>
            <span className={styles.totalPedido}>${pedido.total}</span>
          </div>
        </article>
      ))}
    </div>
  )}
</section>
    </div>
  );
}
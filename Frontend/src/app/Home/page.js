"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [saldo, setSaldo] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const router = useRouter();

  async function cerrarSesion() {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.res);
        router.push("/");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

useEffect(function () {
  fetch("http://localhost:4000/carrito", {
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

          <button onClick={cerrarSesion} className={styles.btnLogout}>Cerrar sesión</button>

        </div>
      </header>
      <main className={styles.bloques}>
        <Link href="/sanguches" className={styles.bloque}>
          <img src="/sanguchegenerico.png"/>
        </Link>

        <Link href="/hamburguesas" className={styles.bloque}>
          <img src="/hamburguesagenerica.png"/>
        </Link>

        <Link href="/bebidas" className={styles.bloque}>
          <img src="/bebidagenerica.png"/>
        </Link>

        <Link href="/snacks" className={styles.bloque}>
          <img src="/snackgenerico.png"/>
        </Link>
      </main>
      <section className={styles.seccionPedidos}>
        <h2 className={styles.subtitulo}>Próximos pedidos</h2>

  {cargandoPedidos ? (<p className={styles.cargando}>Cargando tus pedidos...</p>) : pedidos.length === 0 ? (
    
    <div className={styles.pedidosVacio}>No tenés pedidos en curso</div>) : (
    
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
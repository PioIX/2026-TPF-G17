"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import styles from "./page.module.css";

const API = "http://localhost:4000";

export default function Cocina() {
  const [autorizado, setAutorizado] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [conectado, setConectado] = useState(false);
  const router = useRouter();

  useEffect(function () {
    fetch(API + "/rol", { credentials: "include" })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        if (datos.esAdmin === true) {
          setAutorizado(true);
        } else {
          router.push("/home");
        }
      })
      .catch(function () { router.push("/home"); });
  }, []);

  useEffect(function () {
    if (!autorizado) return;

    function cargarPedidos() {
      fetch(API + "/cocina/pedidos", { credentials: "include" })
        .then(function (respuesta) { return respuesta.json(); })
        .then(function (datos) {
          if (Array.isArray(datos)) {
            setPedidos(datos);
          }
        });
    }

    const socket = io(API, { withCredentials: true });

    socket.on("connect", function () {
      setConectado(true);
      cargarPedidos();
    });

    socket.on("disconnect", function () {
      setConectado(false);
    });

    socket.on("pedidoNuevo", function (nuevo) {
      setPedidos(function (anteriores) {
        const yaEsta = anteriores.some(function (p) {
          return p.id_pedido === nuevo.id_pedido;
        });
        if (yaEsta) return anteriores;
        return [...anteriores, nuevo];
      });
    });

    socket.on("pedidoActualizado", function (datos) {
      setPedidos(function (anteriores) {
        if (datos.estado === "Entregado") {
          return anteriores.filter(function (p) {
            return p.id_pedido !== datos.id_pedido;
          });
        }
        return anteriores.map(function (p) {
          if (p.id_pedido === datos.id_pedido) {
            return { ...p, estado: datos.estado };
          }
          return p;
        });
      });
    });

    return function () { socket.disconnect(); };
  }, [autorizado]);

  function cambiarEstado(id, accion) {
    fetch(API + "/cocina/pedidos/" + id + "/" + accion, {
      method: "POST",
      credentials: "include"
    })
      .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
          if (!respuesta.ok) {
            alert(datos.res);
          }
        });
      })
      .catch(function () {
        alert("No se pudo conectar con el servidor");
      });
  }

  if (!autorizado) {
    return <p>Cargando...</p>;
  }

  const enPreparacion = pedidos.filter(function (p) { return p.estado === "En Preparacion"; });
  const listos = pedidos.filter(function (p) { return p.estado === "Listo"; });

  function dibujarPedido(pedido, textoBoton, accion) {
    return (
      <div className={styles.card} key={pedido.id_pedido}>
        <div className={styles.cardTop}>
          <strong>Pedido #{pedido.id_pedido}</strong>
          <span>{pedido.horario}</span>
        </div>
        <p className={styles.mail}>{pedido.mail}</p>
        <ul className={styles.items}>
          {pedido.items.map(function (item, i) {
            return <li key={i}>{item.cantidad} × {item.nombre}</li>;
          })}
        </ul>
        <button
          className={styles.boton}
          onClick={function () { cambiarEstado(pedido.id_pedido, accion); }}
        >
          {textoBoton}
        </button>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <title>Buffetazo - Cocina</title>

      <header className={styles.header}>
        <h1 className={styles.titulo}>Cocina</h1>
        <p>Pedidos del buffet en tiempo real</p>
        <span className={conectado ? styles.enVivo : styles.sinConexion}>
          {conectado ? "● En vivo" : "● Desconectado"}
        </span>
      </header>

      <div className={styles.columnas}>
        <section>
          <h2 className={styles.subtitulo}>En preparación ({enPreparacion.length})</h2>
          {enPreparacion.length === 0 && <p className={styles.vacio}>No hay pedidos pendientes.</p>}
          {enPreparacion.map(function (p) {
            return dibujarPedido(p, "Marcar listo", "listo");
          })}
        </section>

        <section>
          <h2 className={styles.subtitulo}>Listos para retirar ({listos.length})</h2>
          {listos.length === 0 && <p className={styles.vacio}>Nada esperando retiro.</p>}
          {listos.map(function (p) {
            return dibujarPedido(p, "Entregado", "entregado");
          })}
        </section>
      </div>

      <Link href="/admin" className={styles.volver}>
        Volver al administrador
      </Link>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Bebidas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/bebidas", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error de red:", error);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/saldo", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.saldo !== undefined) setSaldo(data.saldo);
      });
  }, []);

  function agregar(id_producto) {
    fetch("http://localhost:4000/agregar-carrito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_producto }),
    })
      .then((response) => response.json())
      .then((data) => alert(data.res))
      .catch(() => alert("No se pudo conectar con el servidor"));
  }


  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Bebidas</h1>

        <div className={styles.accionesHeader}>
          <div className={styles.badgeSaldo}>Saldo: ${Number(saldo)}</div>

          <Link href="/cargarSaldo" className={styles.btnCargarSaldo}>
            + Cargar Saldo
          </Link>

          <Link href="/carrito" className={styles.btnCarrito}>
            Carrito
          </Link>


          <Link href="/home" className={styles.volver}>
            ← Volver
          </Link>
        </div>
      </header>

      {cargando && <p>Cargando...</p>}
      {!cargando && productos.length === 0 && (
        <p>No hay productos disponibles</p>
      )}

      <div className={styles.lista}>
        {productos.map((p) => (
          <div key={p.id_producto} className={styles.card}>
            <img src={`/${p.imagen}`} alt={p.nombre} className={styles.imagen} />
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p className={styles.precio}>${p.precio}</p>
            <button className={styles.btnAgregar} onClick={() => agregar(p.id_producto)}>
              Agregar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
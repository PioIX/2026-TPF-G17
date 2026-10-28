"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Sanguches() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/sanguches", {
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
      <Link href="/home" className={styles.volver}>
        ← Volver
      </Link>
      <h1 className={styles.titulo}>Sanguches</h1>

      {cargando && <p>Cargando...</p>}
      {!cargando && productos.length === 0 && (
        <p>No hay productos disponibles</p>
      )}

      <div className={styles.lista}>
        {productos.map((p) => (
          <div key={p.id_producto} className={styles.card}>
            <img src={`/${p.imagen}`} alt={p.nombre} />
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
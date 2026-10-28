"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
 import styles from "./page.module.css";

export default function Hamburguesas() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/hamburguesas", {
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

  return (
    <main className={styles.main}>
      <Link href="/home" className={styles.volver}>← Volver</Link>
      <h1 className={styles.titulo}>Hamburguesas</h1>

      {cargando && <p>Cargando...</p>}
      {!cargando && productos.length === 0 && <p>No hay productos disponibles</p>}

      <div className={styles.lista}>
        {productos.map((p) => (
          <div key={p.id_producto} className={styles.card}>
            //agregar las fotos
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <p className={styles.precio}>${p.precio}</p>
          </div>
        ))}
      </div>
    </main>
  );

}
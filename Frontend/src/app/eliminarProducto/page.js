"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function EliminarProducto() {
  const [productos, setProductos] = useState([]);
  const [confirmando, setConfirmando] = useState(null);
  const [aviso, setAviso] = useState(null);

  function mostrarAviso(texto, tipo) {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 2500);
  }

  function cargarProductos() {
    fetch("http://localhost:4000/productos", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        }
      });
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function eliminar(id_producto) {
    fetch("http://localhost:4000/eliminar-producto/" + id_producto, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) =>
        response.json().then((data) => {
          mostrarAviso(data.res, response.ok ? "ok" : "error");
          setConfirmando(null);
          if (response.ok) {
            cargarProductos();
          }
        })
      )
      .catch(() => mostrarAviso("No se pudo conectar con el servidor", "error"));
  }

  return (
    <main className={styles.main}>
      {aviso && (
        <div className={aviso.tipo === "ok" ? styles.avisoOk : styles.avisoError}>
          {aviso.texto}
        </div>
      )}

      <Link href="/home" className={styles.volver}>← Volver</Link>
      <h1 className={styles.titulo}>Eliminar producto</h1>

      <div className={styles.lista}>
        {productos.map((p) => (
          <div key={p.id_producto} className={styles.fila}>
            <img src={`/${p.imagen}`} alt={p.nombre} className={styles.miniatura} />

            <div className={styles.info}>
              <strong>{p.nombre}</strong>
              <span>{p.categoria} · ${p.precio} · Stock: {p.stock}</span>
            </div>

            {confirmando === p.id_producto ? (
              <div className={styles.confirmar}>
                <button className={styles.btnSi} onClick={() => eliminar(p.id_producto)}>
                  Sí, eliminar
                </button>
                <button className={styles.btnNo} onClick={() => setConfirmando(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button className={styles.btnEliminar} onClick={() => setConfirmando(p.id_producto)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Sanguches");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [aviso, setAviso] = useState(null);

  function mostrarAviso(texto, tipo) {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 2500);
  }

  function limpiar() {
    setNombre("");
    setPrecio("");
    setStock("");
    setDescripcion("");
    setImagen("");
  }

  function agregar() {
    fetch("http://localhost:4000/agregar-producto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre, categoria, precio, stock, descripcion, imagen }),
    })
      .then((response) =>
        response.json().then((data) => {
          mostrarAviso(data.res, response.ok ? "ok" : "error");
          if (response.ok) {
            limpiar();
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
      <h1 className={styles.titulo}>Agregar producto</h1>

      <div className={styles.formulario}>
        <label className={styles.campo}>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>

        <label className={styles.campo}>
          Categoría
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Sanguches">Sanguches</option>
            <option value="Hamburguesas">Hamburguesas</option>
            <option value="Snacks">Snacks</option>
            <option value="Bebidas">Bebidas</option>
          </select>
        </label>

        <label className={styles.campo}>
          Precio
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </label>

        <label className={styles.campo}>
          Stock
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>

        <label className={styles.campo}>
          Descripción
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>

        <label className={styles.campo}>
          Imagen (nombre del archivo, ej: cocacola.png)
          <input value={imagen} onChange={(e) => setImagen(e.target.value)} />
        </label>

        <button className={styles.btnGuardar} onClick={agregar}>
          Agregar producto
        </button>
      </div>
    </main>
  );
}
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
  const [archivo, setArchivo] = useState(null);
  const [claveArchivo, setClaveArchivo] = useState(0);
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
    setArchivo(null);
    setClaveArchivo(claveArchivo + 1);
  }

  function agregar() {
    if (nombre === "" || precio === "" || stock === "") {
      mostrarAviso("Completá el nombre, el precio y el stock", "error");
      return;
    }

    if (!archivo) {
      mostrarAviso("Elegí la imagen del producto", "error");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("categoria", categoria);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("descripcion", descripcion);
    formData.append("imagen", archivo);

    fetch("http://localhost:4000/agregar-producto", {
      method: "POST",
      credentials: "include",
      body: formData,
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

      <Link href="/admin" className={styles.volver}>← Volver</Link>
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
          Imagen
          <input
            key={claveArchivo}
            type="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </label>

        <button className={styles.btnGuardar} onClick={agregar}>
          Agregar producto
        </button>
      </div>
    </main>
  );
}
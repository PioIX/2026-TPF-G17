
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function Admin() {
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  useEffect(function () {
    fetch("http://localhost:4000/rol", {
      method: "GET",
      credentials: "include"
    })
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (datos) {
        if (datos.esAdmin === true) {
          setAutorizado(true);
        } else {
          router.push("/home");
        }
      })
      .catch(function () {
        router.push("/home");
      });
  }, []);

  if (!autorizado) {
    return <p>Cargando...</p>;
  }

  return (
    <main className={styles.main}>
      <title>Buffetazo - Administración</title>

      <header className={styles.header}>
        <h1 className={styles.titulo}>Panel de administración</h1>
        <p>Bienvenido al administrador de Buffetazo</p>
      </header>

      <h2 className={styles.subtitulo}>¿Qué querés administrar?</h2>

      <div className={styles.lista}>

        <Link href="/stock" className={styles.card}>
          <h3>Gestionar stock</h3>
          <p>Consultar, sumar y restar unidades de los productos.</p>
          <span className={styles.btn}>Ingresar</span>
        </Link>

        <Link href="/agregarProducto" className={styles.card}>
          <h3>Agregar producto</h3>
          <p>Incorporar nuevos productos al menú del buffet.</p>
          <span className={styles.btn}>Ingresar</span>
        </Link>
    
        <Link href="/admin/eliminar-producto" className={styles.card}>
          <h3>Eliminar producto</h3>
          <p>Eliminar productos que ya no se ofrecen.</p>
          <span className={styles.btn}>Ingresar</span>
        </Link>

      </div>

      <Link href="/home" className={styles.volver}>
        Volver al menú
      </Link>
    </main>
  );
}

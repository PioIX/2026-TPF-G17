"use client";

import Logout from "@/components/Logout";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
   
    return (
        <div className={styles.contenedorPrincipal}>
      <title>Buffetazo - Inicio</title>


      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Buffetazo</h1>

        <div className={styles.accionesHeader}>
          <div className={styles.badgeSaldo}>
            Saldo: $0
          </div>

          <Link href="/cargar-saldo" className={styles.btnCargarSaldo}>
            + Cargar Saldo
          </Link>

          <Link href="/carrito" className={styles.btnCarrito}>
            Carrito 
          </Link>

          <Logout />
        </div>
      </header>
    </div>
  );
}
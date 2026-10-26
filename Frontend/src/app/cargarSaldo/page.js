"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function CargarSaldo() {
  const [monto, setMonto] = useState("");
  const router = useRouter();

  const handleSaldo = async (e) => {

    try {
      const response = await fetch("http://localhost:4000/cargar-saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ monto }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Saldo cargado!");
        router.push("/home");
      } else {
        alert("Error: " + (data.res || "Intente nuevamente"));
      }
    } catch (error) {
      console.error("Error de red en el fetch:", error);
      alert("No se pudo conectar con el servidor");
    }
  };


  return (
    <main className={styles.contenedorPrincipal}>
      <header className={styles.header}>
        <h1 className={styles.tituloHeader}>Buffetazo</h1>
        <div className={styles.accionesHeader}>
          <Link href="/home" className={styles.btnVolverHeader}>Volver</Link>
        </div>
      </header>

      <div className={styles.contenidoPrincipal}>
        <div className={styles.seccionCargarSaldo}>
          <div className={styles.tarjetaCargarSaldo}>
            <h1 className={styles.tituloCargarSaldo}>Cargar saldo</h1>

            <div className={styles.formularioCargar}>
              <input
                type="number"
                placeholder="Monto a cargar"
                value={monto}
                onChange={function (e) { setMonto(e.target.value); }}
                className={styles.inputMonto}
              />
              <button onClick={handleSaldo} type="submit" className={styles.btnCargarSubmit}>
                Cargar saldo
              </button>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
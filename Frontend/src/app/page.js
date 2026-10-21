
"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Inicio() {
  const router = useRouter();

  return (
    <main className={styles.contenedorPrincipal}>
      <div className={styles.tarjetaInicio}>
        <h1 className={styles.tituloInicio}>
          Bienvenido al Buffetazo
        </h1>

        <p className={styles.descripcionInicio}>
          Tu buffet escolar, más fácil y rápido.
        </p>

        <div className={styles.botonesInicio}>
          <button
            className={styles.btnInicio}
            onClick={() => router.push("/login")}
          >
            Ir a Login
          </button>

          <button
            className={styles.btnRegistro}
            onClick={() => router.push("/registro")}
          >
            Ir a Registro
          </button>
        </div>
      </div>
    </main>
  );
}


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mail, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Bienvenido!");
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
    <div className={styles.contenedorPrincipal}>
      <main className={styles.contenedorLogin}>
        <div className={styles.tarjetaLogin}>
          <h1 className={styles.tituloLogin}>Iniciar sesión</h1>

          <p className={styles.descripcionLogin}>
            Ingresá a tu cuenta para continuar.
          </p>

          <form className={styles.formularioLogin} onSubmit={handleSubmit}>
            <div className={styles.campoLogin}>
              <label className={styles.labelLogin}>Mail:</label>
              <input
                className={styles.inputLogin}
                type="email"
                name="mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </div>

            <div className={styles.campoLogin}>
              <label className={styles.labelLogin}>Contraseña:</label>
              <input
                className={styles.inputLogin}
                type="password"
                name="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button className={styles.btnLogin} type="submit">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

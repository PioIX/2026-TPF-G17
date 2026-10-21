
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Register() {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Usuario registrado con éxito!");
        router.push("/login");
      } else {
        alert("Error al registrar: " + (data.res || "Intente nuevamente"));
      }
    } catch (error) {
      console.error("Error de red en el fetch:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <main className={styles.contenedorRegister}>
        <div className={styles.tarjetaRegister}>
          <h1 className={styles.tituloRegister}>Registro de Usuario</h1>

          <p className={styles.descripcionRegister}>
            Creá tu cuenta para comenzar.
          </p>

          <form className={styles.formularioRegister} onSubmit={handleSubmit}>
            <div className={styles.campoRegister}>
              <label className={styles.labelRegister}>Mail:</label>
              <input
                className={styles.inputRegister}
                type="email"
                name="mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </div>

            <div className={styles.campoRegister}>
              <label className={styles.labelRegister}>Contraseña:</label>
              <input
                className={styles.inputRegister}
                type="password"
                name="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button className={styles.btnRegister} type="submit">
              Registrarse
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

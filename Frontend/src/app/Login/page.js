"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        body: JSON.stringify({ mail, setContrasena }),
      });

      const data = await response.json();

      if (data.ok) {
        alert("¡Bienvenido!");
        router.push("/Home");
      } else {
        alert("Error: " + (data.mensaje || "Intente nuevamente"));
      }
    } catch (error) {
      console.error("Error de red en el fetch:", error);
      alert("No se pudo conectar con el servidor"
        
      );
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label>Mail:</label>
        <input
          type="mail"
          name="mail"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
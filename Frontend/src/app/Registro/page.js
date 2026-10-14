"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoUsuario = { mail, contrasena };

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      const data = await response.json();

      if (data.success || data.ok) {
        alert("¡Usuario registrado con éxito!");
        router.push("/Login");
      } else {
        alert("Error al registrar: " + (data.mensaje || "Intente nuevamente"));
      }
    } catch (error) {
      console.error("Error de red en el fetch:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>Mail:</label>
        <input
          type="email"
          name="mail"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="contrasena"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
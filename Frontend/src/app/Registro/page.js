"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoUsuario = { email, password };

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      const data = await response.json();

      if (data.success || data.ok) {
        alert("¡Usuario registrado con éxito!");
        router.push("/login");
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
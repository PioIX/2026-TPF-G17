"use client";

import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const cerrarSesion = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.res);
        router.push("/Login");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <Button onClick={cerrarSesion}>
      Cerrar sesión
    </Button>
  );
}

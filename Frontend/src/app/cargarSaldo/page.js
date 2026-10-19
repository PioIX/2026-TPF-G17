"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <main>
      <h1>Cargar saldo</h1>

        <div>
          <input
            type="number"
            placeholder="Monto a cargar"
            value={monto}
            onChange={function (e) { setMonto(e.target.value); }}
          />
          <button onClick={handleSaldo} type="submit">Cargar saldo</button>
        </div>
    </main>
  );
}
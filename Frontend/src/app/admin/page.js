"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  useEffect(function () {
    fetch("http://localhost:4000/rol", {
      method: "GET",
      credentials: "include"
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        if (datos.esAdmin === true) {
          setAutorizado(true);
        } else {
          router.push("/home");
        }
      })
      .catch(function () {
        router.push("/home");
      });
  }, []);

  if (!autorizado) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <title>Buffetazo - Admin</title>
      <h1>Panel de administración</h1>
    </div>
  );
}
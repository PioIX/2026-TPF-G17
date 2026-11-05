"use client";
import { useState } from "react";
import styles from "./FileUploader.module.css";

export default function FileUploader({ onSubido }) {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [ok, setOk] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setOk(false);
      setMensaje("Por favor seleccioná un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("miArchivo", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onSubido(data.nombre);
        setOk(true);
        setMensaje("¡Archivo subido con éxito!");
      } else {
        setOk(false);
        setMensaje("Error al subir el archivo");
      }
    } catch (error) {
      setOk(false);
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.uploader}>
      <form onSubmit={handleSubmit} className={styles.fila}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className={styles.btnSubir}>
          Subir Archivo
        </button>
      </form>
      {mensaje && (
        <p className={ok ? styles.mensajeOk : styles.mensajeError}>{mensaje}</p>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Sanguches() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/sanguches", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error de red:", error);
        setCargando(false);
      });
  }, []);


}
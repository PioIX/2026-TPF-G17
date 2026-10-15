"use client";

import Logout from "@/components/Logout";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
    const [productos, setProductos] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [pedidosActivos, setPedidosActivos] = useState([]);
    const [categoria, setCategoria] = useState("todos");
    const [loading, setLoading] = useState(true);

    return (
        <>
            <div>
                <title>Buffetazo - Inicio</title>
                <header>
                    <h1>🍔 Buffetazo</h1>
                    <div>
                        <div>
                            Saldo: ${saldo}
                        </div>
                        <Link href="/cargar-saldo">+ Cargar Saldo</Link>
                        <Link href="/carrito">🛒 Carrito</Link>
                        <Logout />
                    </div>
                </header>

                <main>
                    {pedidosActivos.map((pedido) => (
                        pedido.estado === "listo" && (
                            <div key={pedido.id}>
                                <span>🔔 ¡Tu pedido #{pedido.id} está listo para retirar en el Buffet!</span>
                                <button>Entendido</button>
                            </div>
                        )
                    ))}

                    <section>
                        <h2>Categorías</h2>
                        <div>
                            {["almuerzos", "bebidas", "snack"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoria(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2>Menú del Día</h2>
                        {loading ? (
                            <p>Cargando menú...</p>
                        ) : (
                            <div>
                                {productosFiltrados.map((prod) => (
                                    <div key={prod.id}>
                                        <div>
                                            <img src={prod.imagen || "/placeholder.png"} alt={prod.nombre} />
                                            <h3>{prod.nombre}</h3>
                                            <p>{prod.descripcion}</p>
                                        </div>
                                        <div>
                                            <span>${prod.precio}</span>
                                            <button onClick={() => agregarAlCarrito(prod)}>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
}
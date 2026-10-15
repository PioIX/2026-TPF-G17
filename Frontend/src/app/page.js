"use client"
import { useRouter } from "next/navigation";
export default function Inicio() {
    const router = useRouter();
    return (
        <>
        <h1>Bienvenido al Buffetazo</h1>
        <button onClick={() => router.push("/login")}>Ir a Login</button>
        <button onClick={() => router.push("/registro")}>Ir a Registro</button>
        </>
    )
}

import { useRouter } from "next/navigation";
export default function Inicio() {
    const router = useRouter();
    return (
        <>
        <h1>Bienvenido al Buffetazo</h1>
        <button onClick={() => router.push("/Login")}>Ir a Login</button>
        <button onClick={() => router.push("/Registro")}>Ir a Registro</button>
        </>
    )
}
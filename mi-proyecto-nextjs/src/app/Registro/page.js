export default function RegistroPage() {
  return (
    <div>
      <h1>Registro</h1>
      <form>
        <label>
          Nombre:
          <input type="text" name="nombre" />
        </label>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  const botonBase =
    "px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer";

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Farmacia
          </h2>

          <p className="text-emerald-100 text-sm">
            Sistema de gestión
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/home")}
            className={`${botonBase} hover:bg-emerald-600`}
          >
            Inicio
          </button>

          {usuario?.rol === "administrador" && (
            <>
              <button
                onClick={() => navigate("/usuarios")}
                className={`${botonBase} hover:bg-emerald-600`}
              >
                Usuarios
              </button>

              <button
                onClick={() => navigate("/productos")}
                className={`${botonBase} hover:bg-emerald-600`}
              >
                Productos
              </button>

              <button
                onClick={() => navigate("/categorias")}
                className={`${botonBase} hover:bg-emerald-600`}
              >
                Categorías
              </button>
            </>
          )}

          {usuario?.rol === "moderador" && (
            <>
              <button
                onClick={() => navigate("/productos")}
                className={`${botonBase} hover:bg-emerald-600`}
              >
                Productos
              </button>

              <button
                onClick={() => navigate("/categorias")}
                className={`${botonBase} hover:bg-emerald-600`}
              >
                Categorías
              </button>
            </>
          )}

          {usuario?.rol === "usuario" && (
            <button
              onClick={() => navigate("/productos")}
              className={`${botonBase} hover:bg-emerald-600`}
            >
              Productos
            </button>
          )}

          <button
            onClick={cerrarSesion}
            className="ml-3 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-semibold transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
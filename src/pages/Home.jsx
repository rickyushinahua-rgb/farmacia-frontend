import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  const nombreRol = {
    administrador: "Administrador",
    moderador: "Moderador",
    usuario: "Usuario",
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
          <div
            className="
              flex flex-col
              md:flex-row
              md:items-start
              md:justify-between
              gap-5
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Panel principal
              </p>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  text-slate-800
                  mt-2
                  break-words
                "
              >
                Bienvenido, {usuario?.nombre}
              </h1>

              <p className="text-slate-500 mt-3 text-base sm:text-lg">
                Administra la información de la farmacia desde este panel.
              </p>
            </div>

            <div
              className="
                self-start
                bg-emerald-100
                text-emerald-800
                px-5 py-3
                rounded-xl
                shrink-0
              "
            >
              <p className="text-sm">
                Rol
              </p>

              <p className="font-bold">
                {nombreRol[usuario?.rol] || usuario?.rol}
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-5
              mt-8
            "
          >
            <button
              onClick={() => navigate("/productos")}
              className="
                text-left
                border border-slate-200
                rounded-2xl
                p-6
                hover:shadow-md
                hover:border-emerald-300
                transition
                cursor-pointer
              "
            >
              <div className="text-4xl mb-4">
                💊
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                Productos
              </h2>

              <p className="text-slate-500 mt-2">
                Consulta los productos registrados y su categoría.
              </p>
            </button>

            {(usuario?.rol === "administrador" ||
              usuario?.rol === "moderador") && (
              <button
                onClick={() => navigate("/categorias")}
                className="
                  text-left
                  border border-slate-200
                  rounded-2xl
                  p-6
                  hover:shadow-md
                  hover:border-emerald-300
                  transition
                  cursor-pointer
                "
              >
                <div className="text-4xl mb-4">
                  📦
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Categorías
                </h2>

                <p className="text-slate-500 mt-2">
                  Revisa las categorías disponibles en el sistema.
                </p>
              </button>
            )}

            {usuario?.rol === "administrador" && (
              <button
                onClick={() => navigate("/usuarios")}
                className="
                  text-left
                  border border-slate-200
                  rounded-2xl
                  p-6
                  hover:shadow-md
                  hover:border-emerald-300
                  transition
                  cursor-pointer
                "
              >
                <div className="text-4xl mb-4">
                  👥
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Usuarios
                </h2>

                <p className="text-slate-500 mt-2">
                  Administra los usuarios registrados y sus roles.
                </p>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
import Navbar from "../components/Navbar";

function Home() {
  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Panel principal
              </p>

              <h1 className="text-4xl font-bold text-slate-800 mt-2">
                Bienvenido, {usuario?.nombre}
              </h1>

              <p className="text-slate-500 mt-3">
                Administra la información de la farmacia desde este panel.
              </p>
            </div>

            <div className="bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl">
              <p className="text-sm font-medium">
                Rol
              </p>

              <p className="font-bold capitalize">
                {usuario?.rol}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition">
              <div className="text-3xl mb-3">
                💊
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Productos
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Consulta los productos registrados y su categoría.
              </p>
            </div>

            {(usuario?.rol === "administrador" ||
              usuario?.rol === "moderador") && (
              <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition">
                <div className="text-3xl mb-3">
                  📦
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Categorías
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Revisa las categorías disponibles en el sistema.
                </p>
              </div>
            )}

            {usuario?.rol === "administrador" && (
              <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition">
                <div className="text-3xl mb-3">
                  👥
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Usuarios
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  Gestión de usuarios y roles del sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
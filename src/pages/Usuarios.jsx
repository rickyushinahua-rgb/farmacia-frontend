import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const usuarioActual = JSON.parse(
    localStorage.getItem("usuario")
  );

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuarios(response.data);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al obtener usuarios"
      );
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRol = async (idUsuario, nuevoRol) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/usuarios/${idUsuario}/rol`,
        {
          rol: nuevoRol,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje("Rol actualizado correctamente");

      await cargarUsuarios();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al actualizar el rol"
      );
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este usuario?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/usuarios/${idUsuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje("Usuario eliminado correctamente");

      await cargarUsuarios();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al eliminar usuario"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
              Administración
            </p>

            <h1 className="text-3xl font-bold text-slate-800 mt-2">
              Usuarios
            </h1>

            <p className="text-slate-500 mt-2">
              Administra los usuarios y sus roles.
            </p>
          </div>

          {mensaje && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
              {mensaje}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Nombre
                  </th>

                  <th className="px-6 py-4">
                    Correo
                  </th>

                  <th className="px-6 py-4">
                    Rol
                  </th>

                  <th className="px-6 py-4">
                    Cambiar rol
                  </th>

                  <th className="px-6 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id_usuario}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-slate-600">
                      {usuario.id_usuario}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {usuario.nombre}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {usuario.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium capitalize">
                        {usuario.rol}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={usuario.rol}
                        disabled={
                          usuario.id_usuario ===
                          usuarioActual?.id_usuario
                        }
                        onChange={(e) =>
                          cambiarRol(
                            usuario.id_usuario,
                            e.target.value
                          )
                        }
                        className="px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="usuario">
                          Usuario
                        </option>

                        <option value="moderador">
                          Moderador
                        </option>

                        <option value="administrador">
                          Administrador
                        </option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      {usuario.id_usuario ===
                      usuarioActual?.id_usuario ? (
                        <span className="text-sm text-slate-400">
                          Usuario actual
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            eliminarUsuario(
                              usuario.id_usuario
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total de usuarios:{" "}
            <span className="font-semibold text-slate-700">
              {usuarios.length}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Usuarios;
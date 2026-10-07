import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuarioActual = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  const obtenerToken = () => {
    return localStorage.getItem("token");
  };

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios", {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
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
      await api.put(
        `/usuarios/${idUsuario}/rol`,
        {
          rol: nuevoRol,
        },
        {
          headers: {
            Authorization: `Bearer ${obtenerToken()}`,
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
      await api.delete(`/usuarios/${idUsuario}`, {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
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

  const esUsuarioActual = (usuario) => {
    return (
      usuario.id_usuario ===
      usuarioActual?.id_usuario
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
              Administración
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
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

          {/* TABLET Y COMPUTADORA */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
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
                        disabled={esUsuarioActual(
                          usuario
                        )}
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
                      {esUsuarioActual(usuario) ? (
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

          {/* CELULAR */}
          <div className="md:hidden space-y-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id_usuario}
                className="border border-slate-200 rounded-2xl p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">
                      Usuario #{usuario.id_usuario}
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-1 break-words">
                      {usuario.nombre}
                    </h3>
                  </div>

                  <span className="shrink-0 inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold capitalize">
                    {usuario.rol}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Correo
                  </p>

                  <p className="text-sm text-slate-700 mt-1 break-all">
                    {usuario.email}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                    Cambiar rol
                  </label>

                  <select
                    value={usuario.rol}
                    disabled={esUsuarioActual(
                      usuario
                    )}
                    onChange={(e) =>
                      cambiarRol(
                        usuario.id_usuario,
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
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
                </div>

                <div className="mt-5">
                  {esUsuarioActual(usuario) ? (
                    <div className="w-full bg-slate-100 text-slate-500 text-center py-3 rounded-xl text-sm font-medium">
                      Usuario actual
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        eliminarUsuario(
                          usuario.id_usuario
                        )
                      }
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Eliminar usuario
                    </button>
                  )}
                </div>
              </div>
            ))}
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
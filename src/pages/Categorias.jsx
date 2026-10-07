import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const cargarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al obtener categorías"
      );
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
    });

    setModoEdicion(false);
    setCategoriaEditando(null);
  };

  const abrirNuevaCategoria = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setMensaje("");
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const crearCategoria = async () => {
    await api.post("/categorias", {
      nombre: form.nombre,
      descripcion: form.descripcion,
    });

    setMensaje("Categoría creada correctamente");
  };

  const actualizarCategoria = async () => {
    await api.put(`/categorias/${categoriaEditando}`, {
      nombre: form.nombre,
      descripcion: form.descripcion,
    });

    setMensaje("Categoría actualizada correctamente");
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!form.nombre || !form.descripcion) {
      setMensaje("Complete todos los campos");
      return;
    }

    try {
      if (modoEdicion) {
        await actualizarCategoria();
      } else {
        await crearCategoria();
      }

      limpiarFormulario();
      setMostrarFormulario(false);
      await cargarCategorias();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al guardar categoría"
      );
    }
  };

  const editarCategoria = (categoria) => {
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });

    setCategoriaEditando(categoria.id_categoria);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta categoría?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/categorias/${id}`);

      setMensaje("Categoría eliminada correctamente");
      await cargarCategorias();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "No se pudo eliminar la categoría"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Organización de productos
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                Categorías
              </h1>

              <p className="text-slate-500 mt-2">
                Administra las categorías disponibles.
              </p>
            </div>

            {!mostrarFormulario && (
              <button
                onClick={abrirNuevaCategoria}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                Nueva categoría
              </button>
            )}
          </div>

          {mensaje && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
              {mensaje}
            </div>
          )}

          {mostrarFormulario && (
            <form
              onSubmit={guardarCategoria}
              className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                  {modoEdicion
                    ? "Editar categoría"
                    : "Registrar categoría"}
                </h2>

                <button
                  type="button"
                  onClick={cancelarFormulario}
                  className="self-start sm:self-auto text-slate-500 hover:text-red-600 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción
                  </label>

                  <input
                    type="text"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                {modoEdicion
                  ? "Actualizar categoría"
                  : "Guardar categoría"}
              </button>
            </form>
          )}

          {/* TABLET Y COMPUTADORA */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {categorias.map((categoria) => (
                  <tr
                    key={categoria.id_categoria}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {categoria.id_categoria}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {categoria.nombre}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {categoria.descripcion}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            editarCategoria(categoria)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            eliminarCategoria(
                              categoria.id_categoria
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CELULAR */}
          <div className="md:hidden space-y-4">
            {categorias.map((categoria) => (
              <div
                key={categoria.id_categoria}
                className="border border-slate-200 rounded-2xl p-4 bg-white"
              >
                <p className="text-xs font-semibold text-emerald-600 uppercase">
                  Categoría #{categoria.id_categoria}
                </p>

                <h3 className="text-lg font-bold text-slate-800 mt-1 break-words">
                  {categoria.nombre}
                </h3>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Descripción
                  </p>

                  <p className="text-sm text-slate-600 mt-1 break-words">
                    {categoria.descripcion}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() =>
                      editarCategoria(categoria)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarCategoria(
                        categoria.id_categoria
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Total de categorías:{" "}
            <span className="font-semibold">
              {categorias.length}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Categorias;
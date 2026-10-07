import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    id_categoria: "",
  });

  const obtenerToken = () => localStorage.getItem("token");

  const cargarProductos = async () => {
    try {
      const response = await api.get("/productos", {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
        },
      });

      setProductos(response.data);
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al obtener productos"
      );
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error(
        "Error al cargar categorías:",
        error
      );
    }
  };

  useEffect(() => {
    cargarProductos();
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
      precio: "",
      stock: "",
      id_categoria: "",
    });

    setModoEdicion(false);
    setProductoEditando(null);
  };

  const abrirNuevoProducto = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setMensaje("");
  };

  const cancelarFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const crearProducto = async () => {
    await api.post(
      "/productos",
      {
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
        id_categoria: Number(form.id_categoria),
      },
      {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
        },
      }
    );

    setMensaje("Producto creado correctamente");
  };

  const actualizarProducto = async () => {
    await api.put(
      `/productos/${productoEditando}`,
      {
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
        id_categoria: Number(form.id_categoria),
      },
      {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
        },
      }
    );

    setMensaje("Producto actualizado correctamente");
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (
      !form.nombre ||
      !form.precio ||
      !form.stock ||
      !form.id_categoria
    ) {
      setMensaje("Complete todos los campos");
      return;
    }

    try {
      if (modoEdicion) {
        await actualizarProducto();
      } else {
        await crearProducto();
      }

      limpiarFormulario();
      setMostrarFormulario(false);
      await cargarProductos();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al guardar producto"
      );
    }
  };

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
    });

    setProductoEditando(producto.id_producto);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${obtenerToken()}`,
        },
      });

      setMensaje("Producto eliminado correctamente");
      await cargarProductos();
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al eliminar producto"
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
                Gestión de inventario
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                Productos
              </h1>

              <p className="text-slate-500 mt-2">
                Administra los productos registrados.
              </p>
            </div>

            {!mostrarFormulario && (
              <button
                onClick={abrirNuevoProducto}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                Nuevo producto
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
              onSubmit={guardarProducto}
              className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                  {modoEdicion
                    ? "Editar producto"
                    : "Registrar producto"}
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
                    Precio
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoría
                  </label>

                  <select
                    name="id_categoria"
                    value={form.id_categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">
                      Seleccione una categoría
                    </option>

                    {categorias.map((categoria) => (
                      <option
                        key={categoria.id_categoria}
                        value={categoria.id_categoria}
                      >
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
              >
                {modoEdicion
                  ? "Actualizar producto"
                  : "Guardar producto"}
              </button>
            </form>
          )}

          {/* ESCRITORIO Y TABLET */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {productos.map((producto) => (
                  <tr
                    key={producto.id_producto}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      {producto.id_producto}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {producto.nombre}
                    </td>

                    <td className="px-6 py-4">
                      S/ {producto.precio}
                    </td>

                    <td className="px-6 py-4">
                      {producto.stock}
                    </td>

                    <td className="px-6 py-4">
                      {producto.categoria?.nombre}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            editarProducto(producto)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto.id_producto
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
            {productos.map((producto) => (
              <div
                key={producto.id_producto}
                className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">
                      Producto #{producto.id_producto}
                    </p>

                    <h3 className="text-lg font-bold text-slate-800 mt-1 break-words">
                      {producto.nombre}
                    </h3>
                  </div>

                  <span className="shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Stock: {producto.stock}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Precio
                    </span>

                    <span className="font-semibold text-slate-800">
                      S/ {producto.precio}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Categoría
                    </span>

                    <span className="font-semibold text-emerald-700 text-right break-words">
                      {producto.categoria?.nombre}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() =>
                      editarProducto(producto)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarProducto(
                        producto.id_producto
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
            Total de productos:{" "}
            <span className="font-semibold">
              {productos.length}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Productos;
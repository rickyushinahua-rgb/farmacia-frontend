import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
    rol: "usuario",
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (
      !form.nombre ||
      !form.email ||
      !form.password ||
      !form.confirmarPassword
    ) {
      setMensaje("Complete todos los campos");
      return;
    }

    if (form.password.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (form.password !== form.confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/auth/registro", {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: form.rol,
      });

      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al registrar usuario"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">
              +
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Crear cuenta
          </h1>

          <p className="text-slate-500 mt-2">
            Registra un nuevo usuario en el sistema
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirmar contraseña
            </label>

            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              placeholder="Repita su contraseña"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rol
            </label>

            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition"
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

          {mensaje && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition duration-200 cursor-pointer"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
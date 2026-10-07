import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!email || !password) {
      setMensaje("Complete todos los campos");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.usuario)
      );

      navigate("/home");
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
          "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">
              +
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Farmacia
          </h1>

          <p className="text-slate-500 mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@farmacia.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
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
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registro"
            className="text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
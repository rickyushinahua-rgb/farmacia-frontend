import { Navigate } from "react-router-dom";

function RoleRoute({ children, rolesPermitidos }) {
  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default RoleRoute;
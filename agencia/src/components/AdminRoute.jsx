import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user, loading, getUserProfile } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRole = async () => {
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      const profile = await getUserProfile();
      if (!isMounted) return;

      setIsAdmin(profile?.rol === "admin");
      setChecking(false);
    };

    if (!loading) {
      checkRole();
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading, getUserProfile]);

  if (loading || checking) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Verificando acceso...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Debes iniciar sesion para acceder al panel.
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        No tienes permisos para acceder al panel.
      </div>
    );
  }

  return children;
};

export default AdminRoute;

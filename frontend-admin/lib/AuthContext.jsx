"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "./cookies";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const saved = Cookies.get("user");
    if (token && saved) {
      try { 
        // Les cookies sont encodés en URL, on décode pour le JSON
        setUser(JSON.parse(decodeURIComponent(saved))); 
      } catch {
        // Fallback si ce n'est pas du JSON encodé (cas d'un cookie simple)
        try { setUser(JSON.parse(saved)); } catch {}
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Note: On laisse le portail touriste gérer l'écriture des cookies au login 
    // car il a déjà la logique js-cookie avec expiration.
    // Mais on met à jour l'état local ici.
    setUser(userData);
  };

  const logout = () => {
    // Supprimer les cookies pour déconnecter partout
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin:    user?.role === "ADMIN",
      isTouriste: user?.role === "TOURIST",
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);
}

export function useRequireAdmin() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);
}
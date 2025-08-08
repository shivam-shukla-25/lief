import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
      return;
    }
  }, [user, loading, navigate]);

  const handleAuthClick = async () => {
    if (user) {
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    } else {
      navigate("/login");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <nav className="flex items-center justify-between gap-4 py-4 px-5 md:px-10 bg-[#008b8b] text-white shadow-xl">
        <h1 className="text-3xl font-extrabold">Lief</h1>
        <button
          onClick={handleAuthClick}
          className="bg-white text-[#008b8b] font-bold border text-lg hover:bg-[#008b8b] hover:text-white hover:border-white px-4 py-2 rounded-md cursor-pointer"
        >
          {user ? "Logout" : "Login"}
        </button>
      </nav>
      <Outlet />
    </>
  )
}

export default Navbar
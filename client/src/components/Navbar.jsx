import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, setIsOwner, axios } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    const password = prompt("Enter owner access password:");
    if (!password) return toast.error("Password is required");

    try {
      const { data } = await axios.post("/api/owner/change-role", { password });
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        navigate("/owner");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-light" : ""
      }`}
    >
      <Link to="/">
        <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-13" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((item, index) => (
          <Link key={index} to={item.path}>
            {item.name}
          </Link>
        ))}

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button onClick={() => (isOwner ? navigate("/owner") : changeRole())} className="cursor-pointer">
            {isOwner ? "Dashboard" : "Owner "}
          </button>

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button onClick={() => setOpen(!open)} className="sm:hidden cursor-pointer" aria-label="Toggle Menu">
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu toggle" className="h-6 w-6" />
      </button>
    </motion.div>
  );
};

export default Navbar;

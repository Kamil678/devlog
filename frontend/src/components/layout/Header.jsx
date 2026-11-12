import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaUser, FaSun } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../../app/mode/modeSlice";
import { signoutSuccess } from "../../app/user/userSlice";
import Logo from "../../components/ui/Logo";
import Input from "../../components/ui/Input";
import NavLinks from "./navbar/NavLinks";
import ThemeToggle from "./navbar/ThemeToggle";
import UserDropdown from "./navbar/UserDropdown";
import SignInButton from "./navbar/SignInButton";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    setSearchTerm(searchTermFromUrl ?? "");
  }, [location.search]);

  const handleSubmitSearchForm = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) dispatch(signoutSuccess());
      else console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const navLinks = [
    { to: "/", label: "Strona główna" },
    { to: "/about", label: "O mnie" },
    { to: "/projects", label: "Projekty" },
  ];

  return (
    <Navbar className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Logo textSize="text-sm sm:text-xl" />

        <form onSubmit={handleSubmitSearchForm} className="hidden lg:block">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 z-10" />
            <Input placeholder="Szukaj..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </form>

        <Button
          onClick={() => navigate("/search")}
          className="w-9 h-9 lg:hidden rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-0 [&>span]:p-0 [&>span]:flex [&>span]:items-center [&>span]:justify-center"
          color="gray"
          pill
        >
          <AiOutlineSearch className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:order-2">
        <ThemeToggle mode={mode} onToggle={() => dispatch(toggleMode())} />

        {user ? <UserDropdown user={user} onSignout={handleSignout} /> : <SignInButton />}

        <Navbar.Toggle className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-0" />
      </div>

      <NavLinks navLinks={navLinks} currentPath={path} />
    </Navbar>
  );
}

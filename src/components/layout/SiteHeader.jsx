import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogOut, Search, Heart, User } from "lucide-react";
import { useCurrentUser, requireLogin } from "@/hooks/useCurrentUser";
import { useShortlist } from "@/hooks/useShortlist";
import { useAuth } from "@/lib/AuthContext";
import NotificationBell from "@/components/layout/NotificationBell";
import MobileMenu from "@/components/layout/MobileMenu";
import Logo from "@/components/Logo";

const CATEGORIES = [
  { to: "/creators?role=photographer", label: "Фотографы" },
  { to: "/creators?role=model", label: "Модели" },
  { to: "/creators?role=stylist", label: "Стилисты" },
  { to: "/creators?role=makeup", label: "Визажисты" },
  { to: "/creators?role=designer", label: "Дизайнеры" },
  { to: "/creators?role=videographer", label: "Видео" },
  { to: "/creators?role=creative-director", label: "Креатив" },
];

function HeaderLink({ to, label, count, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `border-b py-1 text-[12px] uppercase tracking-[0.1em] transition-colors ${
          isActive && !to.includes("#") ? "border-foreground" : "border-transparent hover:border-foreground/50"
        }`
      }
    >
      {label}
      {count > 0 && <sup className="ml-1 text-[10px]">{count}</sup>}
    </NavLink>
  );
}

export default function SiteHeader() {
  const { data: user } = useCurrentUser();
  const { logout } = useAuth();
  const { ids } = useShortlist();
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profilePointerType = useRef(null);
  const profileMenuRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout(true);
    setLoggingOut(false);
  };

  const links = user
    ? [
        { to: "/creators", label: "Специалисты" },
        { to: "/selected", label: "Выбранные", count: ids.length },
        { to: "/profile/requests", label: "Предложения" },
        // { to: "/profile", label: "Мой профиль", end: true },
      ]
    : [
        { to: "/creators", label: "Специалисты" },
        { to: "/how-it-works", label: "Как это работает" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-sm">
      {/* main row */}
      <div>
        <div className="container-wtf grid h-12 grid-cols-3 items-center md:h-14">
          <div className="flex items-center justify-self-start">
            <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
              {links.map((l) => <HeaderLink key={l.to} {...l} />)}
            </nav>
            <button
              type="button"
              className="flex w-8 flex-col gap-1.5 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`h-px w-6 bg-foreground transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-px w-6 bg-foreground transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`h-px w-6 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>

          <Link to="/" className="flex items-center justify-center" aria-label="THE WILDER — на главную">
            <Logo height={44} className="md:h-[52px]" />
          </Link>

          <div className="flex items-center justify-end gap-5">
            <Link to="/creators" className="hidden text-foreground hover:opacity-60 md:block" aria-label="Поиск">
              <Search size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/selected" className="relative text-foreground hover:opacity-60" aria-label="Выбранные">
              <Heart size={20} strokeWidth={1.5} />
              {ids.length > 0 && <sup className="absolute -right-2 -top-2 text-[10px]">{ids.length}</sup>}
            </Link>
            {user ? (
              <>
                <NotificationBell />
                <div
                  ref={profileMenuRef}
                  className="relative"
                  onPointerDown={(event) => { profilePointerType.current = event.pointerType; }}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") setProfileMenuOpen(true); }}
                  onPointerLeave={(event) => { if (event.pointerType === "mouse") setProfileMenuOpen(false); }}
                  onFocus={() => { if (profilePointerType.current !== "touch") setProfileMenuOpen(true); }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setProfileMenuOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-label="Меню профиля"
                    aria-expanded={profileMenuOpen}
                    aria-controls="profile-menu"
                    onClick={() => {
                      if (profilePointerType.current === "touch") {
                        setProfileMenuOpen((isOpen) => !isOpen);
                      } else {
                        setProfileMenuOpen(true);
                      }
                      profilePointerType.current = null;
                    }}
                    className="flex h-9 w-9 items-center justify-center text-foreground transition-opacity hover:opacity-60"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full z-50 w-48 pt-2">
                      <div id="profile-menu" className="border border-foreground/15 bg-background py-1 shadow-lg">
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="block px-4 py-3 text-sm transition-colors hover:bg-surface"
                        >
                          Профиль
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-3 border-t border-foreground/10 px-4 py-3 text-left text-sm transition-colors hover:bg-surface disabled:opacity-50"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          {loggingOut ? "Выход…" : "Выйти"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button type="button" onClick={requireLogin} className="hidden rounded-full border border-foreground/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background md:block">
                Войти
              </button>
            )}
          </div>
        </div>
      </div>

      {/* category bar */}
      <nav aria-label="Категории" className="hidden border-t border-border/80 md:block">
        <div className="container-wtf flex items-center justify-center gap-8 py-3 text-[10px] uppercase tracking-[0.18em] text-foreground/75">
          {CATEGORIES.map((c) => (
            <Link key={c.to} to={c.to} className="transition-colors hover:text-accent">{c.label}</Link>
          ))}
        </div>
      </nav>

      {open && <MobileMenu links={links} user={user} onNavigate={() => setOpen(false)} />}
    </header>
  );
}
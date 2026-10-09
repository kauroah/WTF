import React from "react";
import { Link } from "react-router-dom";
import { requireLogin } from "@/hooks/useCurrentUser";

export default function MobileMenu({ links, user, onNavigate }) {
  return (
    <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-background px-5 py-8 md:hidden">
      <nav aria-label="Мобильная навигация">
        <ul className="border-t border-border">
          {links.map((l) => (
            <li key={l.to} className="border-b border-border">
              <Link to={l.to} onClick={onNavigate} className="flex items-center justify-between py-5 text-sm uppercase tracking-[0.1em]">
                <span>{l.label}</span>
                {l.count > 0 && <span className="text-[11px] text-muted-foreground">{l.count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {!user && (
        <div className="mt-auto grid gap-3 pt-10">
          <Link to="/onboarding" onClick={onNavigate} className="btn-primary w-full">Создать профиль</Link>
          <button type="button" onClick={requireLogin} className="btn-secondary w-full">Войти</button>
        </div>
      )}
    </div>
  );
}
"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const routeStateKey = (pathname) => `next-route-state:${pathname}`;

function saveRouteState(href, state) {
  if (typeof window !== "undefined" && state) {
    const pathname = new URL(href, window.location.origin).pathname;
    window.sessionStorage.setItem(routeStateKey(pathname), JSON.stringify(state));
  }
}

function takeRouteState(pathname) {
  if (typeof window === "undefined") return null;
  const key = routeStateKey(pathname);
  const serialized = window.sessionStorage.getItem(key);
  if (!serialized) return null;
  window.sessionStorage.removeItem(key);
  try {
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}

export function Link({ to, state, children, onClick, ...props }) {
  const href = typeof to === "string" ? to : to?.pathname || "/";
  return (
    <NextLink
      href={href}
      onClick={(event) => {
        if (!event.defaultPrevented) saveRouteState(href, state);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export function NavLink({ to, end = false, className, children, ...props }) {
  const pathname = usePathname();
  const href = typeof to === "string" ? to : to?.pathname || "/";
  const targetPath = href.split(/[?#]/, 1)[0];
  const active = end ? pathname === targetPath : pathname === targetPath || pathname.startsWith(`${targetPath}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive: active }) : className;
  return <Link to={href} className={resolvedClassName} aria-current={active ? "page" : undefined} {...props}>{children}</Link>;
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const searchParams = useNextSearchParams();
  const [hash, setHash] = useState("");
  const [state, setState] = useState(null);

  useEffect(() => {
    setHash(window.location.hash);
    setState(takeRouteState(pathname));
  }, [pathname]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return { pathname, search: searchParams.size ? `?${searchParams}` : "", hash, state, key: pathname };
}

export function useNavigate() {
  const router = useRouter();
  return useCallback((to, options = {}) => {
    if (typeof to === "number") {
      if (to < 0) router.back();
      else if (to > 0) router.forward();
      return;
    }
    saveRouteState(to, options.state);
    if (options.replace) router.replace(to, { scroll: options.preventScrollReset !== true });
    else router.push(to, { scroll: options.preventScrollReset !== true });
  }, [router]);
}

export function useParams() {
  return useNextParams() || {};
}

export function useSearchParams() {
  const currentParams = useNextSearchParams();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const setSearchParams = useCallback((nextParams, options = {}) => {
    const params = typeof nextParams === "function"
      ? nextParams(new URLSearchParams(currentParams.toString()))
      : nextParams;
    const serialized = new URLSearchParams(params).toString();
    const href = serialized ? `${pathname}?${serialized}` : pathname;
    if (options.replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  }, [currentParams, pathname, router]);

  return [new URLSearchParams(currentParams.toString()), setSearchParams];
}

export function Navigate({ to, replace = false }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [replace, router, to]);
  return null;
}

export function useNavigationType() {
  return "PUSH";
}
import { CITIES, nameOf, roleNames } from "@/lib/wtf";

export function filterCreators(list, { q, role, city, specialization, available }) {
  const term = q.trim().toLowerCase();
  const cityName = city && nameOf(CITIES, city);
  return list.filter((p) => {
    if (role && !p.roles?.includes(role)) return false;
    if (specialization && !p.specializations?.includes(specialization)) return false;
    if (cityName && p.city !== cityName) return false;
    if (available && !p.available) return false;
    if (!term) return true;
    const haystack = [p.full_name, p.username, p.city, ...roleNames(p), ...(p.roles || []), ...(p.specializations || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}
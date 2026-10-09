export const ROLES = [
  { slug: "photographer", name: "Фотограф" },
  { slug: "model", name: "Модель" },
  { slug: "stylist", name: "Стилист" },
  { slug: "designer", name: "Дизайнер" },
  { slug: "makeup", name: "Визажист" },
  { slug: "creative-director", name: "Creative Director" },
  { slug: "retoucher", name: "Ретушер" },
  { slug: "videographer", name: "Видеограф" },
  { slug: "brand", name: "Бренд" },
];

export const SPECIALIZATIONS = [
  "fashion", "editorial", "beauty", "commercial", "streetwear",
  "lookbook", "campaign", "portrait", "runway",
].map((slug) => ({ slug, name: slug[0].toUpperCase() + slug.slice(1) }));

export const CITIES = [
  { slug: "moscow", name: "Москва" },
  { slug: "spb", name: "Санкт-Петербург" },
  { slug: "kazan", name: "Казань" },
  { slug: "ekb", name: "Екатеринбург" },
  { slug: "nsk", name: "Новосибирск" },
  { slug: "nn", name: "Нижний Новгород" },
];

export const EXPERIENCE = [
  { slug: "lt1", name: "До 1 года" },
  { slug: "1-3", name: "1–3 года" },
  { slug: "3-5", name: "3–5 лет" },
  { slug: "5plus", name: "5+ лет" },
];

export const PORTFOLIO_MIN = 3;
export const PORTFOLIO_MAX = 10;

export const nameOf = (list, slug) => list.find((i) => i.slug === slug)?.name || slug;
export const roleNames = (p) => (p.roles || []).map((r) => nameOf(ROLES, r));
export const specNames = (p) => (p.specializations || []).map((s) => nameOf(SPECIALIZATIONS, s));
export const coverOf = (p) => p.portfolio?.[0]?.url || p.avatar_url;
export const pad = (n) => String(n).padStart(2, "0");

export function plural(n, forms) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}

const handle = (v) => v.replace(/^@/, "");
export const contactLinks = (p) => [
  p.instagram && { label: "Instagram", value: p.instagram, href: p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${handle(p.instagram)}` },
  p.telegram && { label: "Telegram", value: p.telegram, href: p.telegram.startsWith("http") ? p.telegram : `https://t.me/${handle(p.telegram)}` },
  p.website && { label: "Сайт", value: p.website.replace(/^https?:\/\//, ""), href: p.website.startsWith("http") ? p.website : `https://${p.website}` },
].filter(Boolean);
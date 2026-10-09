const WORK_IMAGES = [
  "1539109136881-3be0616acf4b",
  "1529139574466-a303027c1d8b",
  "1515886657613-9f3515b0c78f",
  "1496747611176-843222e1e57c",
  "1509631179647-0177331693ae",
  "1483985988355-763728e1935b",
  "1524504388940-b1c1722653e1",
  "1534528741775-53994a69daeb",
  "1485230895905-ec40ba36b9bc",
  "1525507119028-ed4c629a60a3",
  "1551232864-3a0890e1fd6d",
  "1550614000-4895a10e1bfd",
  "1554412933-514a83d2f3c8",
  "1490481651871-ab68de25d43d",
  "1539533018447-63fcce2678e3",
  "1523381210434-271e8be1f52b",
  "1551488831-00ddcb6c6bd3",
  "1485968579580-b6d095142e6e",
];

const SHOWCASE_USERS = {
  "maria-kuznetsova": { category: "model", index: 0 },
  "anna-volkova": { category: "photographer", index: 1 },
  "ilya-romanov": { category: "photographer", index: 2 },
  "maxim-orlov": { category: "model", index: 3 },
  "sofia-belova": { category: "stylist", index: 4 },
  "ekaterina-lebedeva": { category: "stylist", index: 5 },
  "daria-sokolova": { category: "makeup", index: 6 },
  "alex-morozov": { category: "designer", index: 7 },
  "nikita-fedorov": { category: "designer", index: 8 },
  "alina-smirnova": { category: "makeup", index: 9 },
};

const WORK_TITLES = {
  model: ["Editorial portrait", "Runway study", "Beauty story"],
  photographer: ["Fashion story", "Light study", "Studio portrait"],
  stylist: ["Lookbook styling", "Layered forms", "Editorial wardrobe"],
  makeup: ["Beauty editorial", "Skin and light", "Color study"],
  designer: ["Silhouette study", "Textile exploration", "Collection lookbook"],
};

const WORK_STORIES = {
  model: [
    "История о движении и характере: от точной студийной пластики до живых, почти случайных моментов между дублями.",
    "Образ для подиума, построенный на выразительном движении, скульптурном силуэте и строгой монохромной палитре.",
    "Крупный beauty-портрет о естественной текстуре кожи, мягком свете и сдержанной выразительности.",
  ],
  photographer: [
    "Редакционная съёмка о переменчивом свете и выразительных силуэтах. Постановочные кадры постепенно переходят в живые моменты между дублями.",
    "Исследование направленного света: одна точка освещения проявляет фактуру ткани, кожи и тени.",
    "Портретная съёмка без лишних деталей: один герой, спокойная площадка и выверенная композиция.",
  ],
  stylist: [
    "Гардеробная история на контрасте точного кроя и свободных пропорций. Каждый образ выглядит собранно, но не перегруженно.",
    "Эксперимент с объёмом и фактурой: многослойные формы объединены сдержанной цветовой палитрой.",
    "Подборка образов, где чистые линии сочетаются с выразительными материалами и редакционным настроением.",
  ],
  makeup: [
    "Beauty-образ с акцентом на сияющую кожу и чистые линии: фактура и выражение остаются в центре каждого кадра.",
    "Крупный план, мягкий свет и небольшие детали, благодаря которым макияж выглядит индивидуальным.",
    "Точный эксперимент с цветом: минимальная база и один выразительный акцент на глазах и губах.",
  ],
  designer: [
    "Исследование силуэта: от первых экспериментов с формой до законченного образа, который можно носить каждый день.",
    "Работа с материалом, конструкцией и фактурой. Съёмка подчёркивает детали и характер каждой вещи.",
    "Компактный лукбук, который раскрывает коллекцию через точный стайлинг и скульптурные формы.",
  ],
};

const CATEGORY_ROLES = {
  model: "Модель",
  photographer: "Фотограф",
  stylist: "Стилист",
  makeup: "Визажист",
  designer: "Дизайнер",
};

const imageUrl = (index) =>
  `https://images.unsplash.com/photo-${WORK_IMAGES[index % WORK_IMAGES.length]}?auto=format&fit=crop&w=1600&q=85`;

function withDemoImages(item, showcase, index) {
  const images = Array.isArray(item.images) ? item.images : [];
  const start = (showcase.index * 2 + index + 1) % WORK_IMAGES.length;
  const matchingStory = /runway|подіум|подиум/i.test(item.title || "") ? 1 : index % 3;
  const supplemental = [imageUrl(start), imageUrl(start + 1)]
    .filter((url) => url !== item.url && !images.includes(url));

  return {
    ...item,
    images: [...images, ...supplemental].slice(0, 2),
    demo_gallery: images.length < 2,
    story: item.story || WORK_STORIES[showcase.category][matchingStory],
    project_role: item.project_role || CATEGORY_ROLES[showcase.category],
    client: item.client || "Редакционная съёмка",
    year: item.year || "2026",
    demo_story: !item.story,
  };
}

export function withDemoPortfolio(profile) {
  const showcase = SHOWCASE_USERS[profile?.username];

  if (!showcase) return profile;

  const portfolio = (Array.isArray(profile.portfolio)
    ? profile.portfolio
    : []).map((item, index) => withDemoImages(item, showcase, index));

  if (portfolio.length >= 3) return { ...profile, portfolio };

  const titleSet = WORK_TITLES[showcase.category];
  const start = (showcase.index * 2) % WORK_IMAGES.length;
  const seenUrls = new Set(portfolio.map((item) => item.url));
  const sampleWorks = Array.from({ length: 3 }, (_, index) => {
    const imageIndex = (start + index) % WORK_IMAGES.length;

    return withDemoImages({
      url: imageUrl(imageIndex),
      type: "image",
      title: titleSet[index],
      description: ["Редакционная история", "Свет и форма", "Съёмка для портфолио"][index],
      story: WORK_STORIES[showcase.category][index],
      demo_sample: true,
    }, showcase, index + portfolio.length);
  }).filter((item) => !seenUrls.has(item.url));

  return {
    ...profile,
    portfolio: [
      ...portfolio,
      ...sampleWorks.slice(0, Math.max(0, 3 - portfolio.length)),
    ],
  };
}
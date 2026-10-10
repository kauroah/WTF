do $$
declare
  seed_owner_id uuid;
begin
  select id
  into seed_owner_id
  from auth.users
  order by created_at
  limit 1;

  if seed_owner_id is null then
    raise exception 'Register at least one user before seeding projects.';
  end if;

  insert into public.projects (
    id,
    owner_user_id,
    owner_profile_id,
    title,
    brief,
    role,
    specialization,
    city,
    budget,
    status
  )
  select
    seed.id,
    seed_owner_id,
    profile.id,
    seed.title,
    seed.brief,
    seed.role,
    seed.specialization,
    seed.city,
    seed.budget,
    'open'
  from (
    values
      (
        'f2a78137-c47f-4e65-8938-1c348c0c1001'::uuid,
        'Съёмка новой весенней коллекции',
        'Ищем фотографа для кампейна локального бренда одежды. Нужны студийные и несколько уличных кадров, полный съёмочный день. Портфолио и краткое описание подхода приложите к отклику.',
        'photographer',
        'campaign',
        'moscow',
        'от 45 000 ₽'
      ),
      (
        'f2a78137-c47f-4e65-8938-1c348c0c1002'::uuid,
        'Стайлинг для редакционной истории',
        'Готовим editorial-съёмку о городской весне. Нужен стилист, который соберёт 5 образов и поможет с подбором вещей у локальных марок. Дата и референсы согласуем вместе.',
        'stylist',
        'editorial',
        'spb',
        'от 25 000 ₽'
      ),
      (
        'f2a78137-c47f-4e65-8938-1c348c0c1003'::uuid,
        'Модель для лукбука украшений',
        'Бренд украшений ищет модель для камерного лукбука: портреты и крупные планы изделий. Съёмка займёт около четырёх часов, опыт коммерческих съёмок будет плюсом.',
        'model',
        'lookbook',
        'moscow',
        'от 18 000 ₽'
      ),
      (
        'f2a78137-c47f-4e65-8938-1c348c0c1004'::uuid,
        'Визажист на beauty-съёмку',
        'Ищем визажиста для beauty-съёмки новой линейки ухода. В задаче три естественных образа, работа в студии и короткая подготовка перед съёмкой.',
        'makeup',
        'beauty',
        'kazan',
        'от 20 000 ₽'
      ),
      (
        'f2a78137-c47f-4e65-8938-1c348c0c1005'::uuid,
        'Видео для запуска капсулы',
        'Нужен видеограф для короткого fashion-фильма о запуске капсульной коллекции. Планируем съёмку на один день; в результате нужны ролик до минуты и несколько вертикальных фрагментов.',
        'videographer',
        'commercial',
        'ekb',
        'от 35 000 ₽'
      )
  ) as seed(id, title, brief, role, specialization, city, budget)
  left join public.profiles as profile
    on profile.user_id = seed_owner_id
  on conflict (id) do nothing;
end
$$;
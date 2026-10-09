import { supabase } from "@/api/supabaseClient";
import { PORTFOLIO_MIN, PORTFOLIO_MAX } from "@/lib/wtf";

export const EMPTY_FORM = {
  full_name: "",
  username: "",
  city: "",
  roles: [],
  specializations: [],
  bio: "",
  experience_level: "",
  available: true,
  telegram: "",
  instagram: "",
  website: "",
  avatar_url: "",
  portfolio: [],
};

const FIELDS = Object.keys(EMPTY_FORM);

export function toForm(profile, user) {
  const form = {
    ...EMPTY_FORM,

    // Supabase Auth stores OAuth/user metadata here.
    full_name:
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.full_name ||
      "",

    id: profile?.id,
  };

  FIELDS.forEach((key) => {
    if (profile && profile[key] != null) {
      form[key] = profile[key];
    }
  });

  return form;
}

export function toRecord(form) {
  const record = {};

  FIELDS.forEach((key) => {
    record[key] =
      typeof form[key] === "string"
        ? form[key].trim()
        : form[key];
  });

  if (!record.experience_level) {
    delete record.experience_level;
  }

  return record;
}

const USERNAME = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const HANDLE =
  /^(@?[\w.]{2,32}|https?:\/\/\S+)$/;

const URL_RE =
  /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/;

export const FIELD_STEP = {
  full_name: 1,
  username: 1,
  city: 1,
  roles: 2,
  specializations: 3,
  bio: 4,
  telegram: 5,
  instagram: 5,
  website: 5,
  portfolio: 7,
};

export function validateStep(step, form) {
  const errors = {};

  if (step === 1) {
    if (!form.full_name.trim()) {
      errors.full_name = "Укажите имя и фамилию";
    }

    if (!USERNAME.test(form.username)) {
      errors.username =
        "3–30 символов: латиница, цифры и дефис";
    }

    if (!form.city) {
      errors.city = "Выберите город";
    }
  }

  if (step === 2 && !form.roles.length) {
    errors.roles = "Выберите хотя бы одну роль";
  }

  if (step === 3 && !form.specializations.length) {
    errors.specializations =
      "Выберите хотя бы одно направление";
  }

  if (step === 4 && form.bio.length > 600) {
    errors.bio = "Не более 600 символов";
  }

  if (step === 5) {
    if (
      form.telegram &&
      !HANDLE.test(form.telegram.trim())
    ) {
      errors.telegram =
        "Укажите @username или ссылку";
    }

    if (
      form.instagram &&
      !HANDLE.test(form.instagram.trim())
    ) {
      errors.instagram =
        "Укажите @username или ссылку";
    }

    if (
      form.website &&
      !URL_RE.test(form.website.trim())
    ) {
      errors.website = "Проверьте адрес сайта";
    }
  }

  if (step === 7) {
    if (form.portfolio.length < PORTFOLIO_MIN) {
      errors.portfolio =
        `Добавьте минимум ${PORTFOLIO_MIN} работы`;
    }

    if (form.portfolio.length > PORTFOLIO_MAX) {
      errors.portfolio =
        `Не более ${PORTFOLIO_MAX} работ`;
    }
  }

  return errors;
}

/**
 * Check username uniqueness in Supabase.
 */
async function isUsernameTaken(username, ownId) {
  let query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);

  // When editing our existing profile, ignore our own row.
  if (ownId) {
    query = query.neq("id", ownId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Username availability check failed:",
      error
    );

    throw error;
  }

  return data.length > 0;
}

export async function validateStepAsync(step, form) {
  const errors = validateStep(step, form);

  if (
    step === 1 &&
    !errors.username &&
    (await isUsernameTaken(
      form.username.trim(),
      form.id
    ))
  ) {
    errors.username =
      "Этот username уже занят";
  }

  return errors;
}

export async function validateAllAsync(form) {
  const errors = Object.assign(
    {},
    ...[2, 3, 4, 5, 7].map((step) =>
      validateStep(step, form)
    )
  );

  return {
    ...(await validateStepAsync(1, form)),
    ...errors,
  };
}

export const firstStepWithError = (errors) =>
  Math.min(
    ...Object.keys(errors).map(
      (key) => FIELD_STEP[key] || 1
    )
  );
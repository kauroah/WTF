import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { supabase } from "@/api/supabaseClient";
import { filterCreators } from "@/lib/filterCreators";
import { plural } from "@/lib/wtf";
import { usePageMeta } from "@/hooks/usePageMeta";

import CreatorFilters from "@/components/creators/CreatorFilters";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorGridSkeleton from "@/components/creators/CreatorGridSkeleton";
import EmptyState from "@/components/shared/EmptyState";

/**
 * Fetch all published creators.
 *
 * Base44 equivalent:
 *
 * Profile.filter(
 *   { status: "published" },
 *   "-updated_date",
 *   300
 * )
 */
export const usePublishedCreators = () =>
  useQuery({
    queryKey: ["creators"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "published")
        .order("updated_at", {
          ascending: false,
        })
        .limit(300);

      if (error) {
        throw error;
      }

      return data ?? [];
    },

    staleTime: 5 * 60 * 1000,
  });

export default function Creators() {
  usePageMeta("Найти специалиста");

  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      role: searchParams.get("role") || "",
      city: searchParams.get("city") || "",
      specialization:
        searchParams.get("specialization") || "",
      available: searchParams.get("available") === "1",
    }),
    [searchParams]
  );

  const [query, setQuery] = useState(params.q);

  const {
    data: profiles = [],
    isLoading,
    isError,
    refetch,
  } = usePublishedCreators();

  const results = useMemo(
    () => filterCreators(profiles, params),
    [
      profiles,
      params.q,
      params.role,
      params.city,
      params.specialization,
      params.available,
    ]
  );

  const setParam = useCallback(
    (key, value, replace = false) => {
      const next = new URLSearchParams(searchParams);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setQuery(params.q);
  }, [params.q]);

  /**
   * Debounce search input before writing it to the URL.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query !== params.q) {
        setParam("q", query, true);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, params.q, setParam]);

  const activeCount =
    ["role", "city", "specialization"].filter(
      (key) => params[key]
    ).length + (params.available ? 1 : 0);

  const reset = () => {
    setQuery("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-mono text-muted-foreground">
            Каталог —{" "}
            {isLoading
              ? "…"
              : `${results.length} ${plural(results.length, [
                  "специалист",
                  "специалиста",
                  "специалистов",
                ])}`}
          </p>

          <h1 className="mt-3 max-w-xl font-display text-[clamp(2.8rem,4vw,5rem)] leading-[0.9] tracking-[-0.04em]">
            Найти специалиста
          </h1>
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-foreground/60 md:text-right">
          Curated professionals for fashion, beauty, commercial and editorial production.
        </p>
      </div>

      <div className="mt-8 border-b border-foreground/20 pb-4 md:mt-12">
        <div className="flex items-center gap-3">
          <Search
            className="h-4 w-4 shrink-0 text-foreground/60 md:h-5 md:w-5"
            aria-hidden="true"
          />

          <label htmlFor="creator-search" className="sr-only">
            Поиск
          </label>

          <input
            id="creator-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Имя, профессия или специализация"
            className="w-full bg-transparent py-2 text-lg placeholder:text-muted-foreground/60 focus:outline-none md:text-2xl"
          />
        </div>
      </div>

      <div className="mb-10 mt-8 md:mb-14">
        <CreatorFilters
          params={params}
          setParam={setParam}
          onReset={reset}
          activeCount={activeCount}
          resultCount={results.length}
        />
      </div>

      {isLoading ? (
        <CreatorGridSkeleton />
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить каталог"
          text="Проверьте соединение и попробуйте ещё раз."
        >
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary"
          >
            Повторить
          </button>
        </EmptyState>
      ) : results.length ? (
        <CreatorGrid profiles={results} />
      ) : (
        <EmptyState
          title="По вашему запросу ничего не найдено"
          text="Попробуйте убрать часть фильтров или изменить запрос."
        >
          <button
            type="button"
            onClick={reset}
            className="btn-secondary"
          >
            Сбросить фильтры
          </button>
        </EmptyState>
      )}
    </div>
  );
}
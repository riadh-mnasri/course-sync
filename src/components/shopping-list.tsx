"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import type { Habit, Item } from "@/lib/types";

const PROFILE_KEY = "course-sync-profile-name";

export default function ShoppingList() {
  const t = useTranslations("list");
  const ts = useTranslations("suggestions");

  const [items, setItems] = useState<Item[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfileName(localStorage.getItem(PROFILE_KEY));

    async function load() {
      const { data: itemsData } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: true });
      if (itemsData) setItems(itemsData);

      const { data: habitsData } = await supabase
        .from("item_habits")
        .select("*");
      if (habitsData) setHabits(habitsData);

      setLoaded(true);
    }
    load();

    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as Item;
            setItems((prev) =>
              prev.some((i) => i.id === row.id) ? prev : [...prev, row],
            );
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as Item;
            setItems((prev) => prev.map((i) => (i.id === row.id ? row : i)));
          } else if (payload.eventType === "DELETE") {
            const row = payload.old as Item;
            setItems((prev) => prev.filter((i) => i.id !== row.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sortedItems = useMemo(() => {
    const pending = items
      .filter((i) => !i.checked)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    const checked = items
      .filter((i) => i.checked)
      .sort((a, b) => (a.checked_at ?? "").localeCompare(b.checked_at ?? ""));
    return [...pending, ...checked];
  }, [items]);

  const dueSuggestions = useMemo(() => {
    const activeNames = new Set(items.map((i) => i.name.trim().toLowerCase()));
    return habits
      .filter((h) => !activeNames.has(h.name_key))
      .filter(
        (h) =>
          h.avg_interval_seconds > 0 &&
          h.seconds_since_last_purchase >= h.avg_interval_seconds * 0.85,
      )
      .sort(
        (a, b) =>
          b.seconds_since_last_purchase / b.avg_interval_seconds -
          a.seconds_since_last_purchase / a.avg_interval_seconds,
      )
      .slice(0, 8);
  }, [items, habits]);

  async function addItem(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setNewItemName("");
    await supabase
      .from("items")
      .insert({ name: trimmed, added_by: profileName });
  }

  async function toggleItem(item: Item) {
    await supabase
      .from("items")
      .update({
        checked: !item.checked,
        checked_at: !item.checked ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
  }

  async function removeItem(id: string) {
    await supabase.from("items").delete().eq("id", id);
  }

  async function clearChecked() {
    const checkedItems = items.filter((i) => i.checked);
    if (checkedItems.length === 0) return;
    await supabase
      .from("item_history")
      .insert(checkedItems.map((i) => ({ name: i.name })));
    await supabase
      .from("items")
      .delete()
      .in(
        "id",
        checkedItems.map((i) => i.id),
      );
    const { data: habitsData } = await supabase.from("item_habits").select("*");
    if (habitsData) setHabits(habitsData);
  }

  function saveProfileName() {
    const trimmed = profileDraft.trim();
    if (!trimmed) return;
    localStorage.setItem(PROFILE_KEY, trimmed);
    setProfileName(trimmed);
  }

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
      {profileName === null && loaded && (
        <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-3 text-sm shadow-sm">
          <span className="text-stone-500">Comment tu t&rsquo;appelles ?</span>
          <input
            value={profileDraft}
            onChange={(e) => setProfileDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveProfileName()}
            className="flex-1 rounded-lg border border-stone-200 px-2 py-1 outline-none focus:border-emerald-400"
            placeholder="Prénom"
          />
          <button
            onClick={saveProfileName}
            className="rounded-lg bg-stone-900 px-3 py-1 text-white transition hover:bg-stone-700"
          >
            OK
          </button>
        </div>
      )}

      {dueSuggestions.length > 0 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-amber-700">
              {ts("title")}
            </h2>
            <span className="text-xs text-stone-400">{ts("subtitle")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dueSuggestions.map((h) => (
              <button
                key={h.name_key}
                onClick={() => addItem(h.name)}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-800 transition hover:border-amber-300 hover:bg-amber-100"
              >
                + {h.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem(newItemName);
        }}
        className="flex gap-2"
      >
        <input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={t("addPlaceholder")}
          className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="submit"
          className="rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          {t("add")}
        </button>
      </form>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-stone-500">
          {t("itemCount", { count: items.filter((i) => !i.checked).length })}
        </span>
        {checkedCount > 0 && (
          <button
            onClick={clearChecked}
            className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
          >
            {t("clearChecked")}
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {sortedItems.length === 0 && loaded && (
          <li className="rounded-2xl border border-dashed border-stone-200 px-4 py-8 text-center text-stone-400">
            {t("empty")}
          </li>
        )}
        {sortedItems.map((item) => (
          <li
            key={item.id}
            className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition ${
              item.checked
                ? "border-stone-100 bg-stone-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <button
              onClick={() => toggleItem(item)}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                item.checked
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-stone-300 hover:border-emerald-400"
              }`}
              aria-label="checkbox"
            >
              {item.checked && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-base ${
                item.checked ? "text-stone-400 line-through" : "text-stone-900"
              }`}
            >
              {item.name}
            </span>
            {item.added_by && (
              <span className="hidden text-xs text-stone-300 sm:inline">
                {item.added_by}
              </span>
            )}
            <button
              onClick={() => removeItem(item.id)}
              className="text-stone-300 opacity-0 transition group-hover:opacity-100 hover:text-stone-500"
              aria-label="remove"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

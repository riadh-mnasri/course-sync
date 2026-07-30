import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";
import ShoppingList from "@/components/shopping-list";

export default function Home() {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-900">
              🧺 {t("name")}
            </h1>
            <p className="text-sm text-stone-500">{t("tagline")}</p>
          </div>
          <LocaleSwitcher />
        </div>
      </header>
      <ShoppingList />
    </div>
  );
}

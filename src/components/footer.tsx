import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-400">
      {t("copyright", { year })}
    </footer>
  );
}

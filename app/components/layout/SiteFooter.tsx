import { usePage } from "~/content/useCopy";

export function SiteFooter() {
  const { copy } = usePage();
  return (
    <footer className="mx-gutter mb-20 mt-24 flex flex-wrap justify-between gap-2 border-t border-line pt-6 text-meta text-muted md:mb-8">
      <span>© 2026 Bernardo Kunz</span>
      <span>{copy.footer}</span>
    </footer>
  );
}

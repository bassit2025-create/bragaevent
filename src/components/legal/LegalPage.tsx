type Section = { heading: string; body: string };

export function LegalPage({
  title,
  intro,
  sections,
  lastUpdatedLabel,
  lastUpdatedDate,
}: {
  title: string;
  intro: string;
  sections: Section[];
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {lastUpdatedLabel}: {lastUpdatedDate}
      </p>

      <p className="mt-8 leading-relaxed text-ink-soft">{intro}</p>

      <div className="mt-8 flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-lg font-bold text-ink">
              {section.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

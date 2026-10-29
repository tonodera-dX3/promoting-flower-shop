export default function PublicUrlBox({ url }: { url: string }) {
  return (
    <section className="flex flex-col gap-1.5 rounded-2xl bg-card p-4">
      <h2 className="text-base font-bold text-primary">公開ページのURL</h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center break-all text-base text-secondary underline"
      >
        {url}
      </a>
    </section>
  );
}

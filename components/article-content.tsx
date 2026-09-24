import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\`[^\`]+\`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else {
      nodes.push(
        <code key={match.index} className="rounded bg-[#ece7dc] px-1.5 py-0.5 text-[0.9em]">
          {token.slice(1, -1)}
        </code>,
      );
    }

    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function autoLeadIn(text: string, followedByList: boolean): ReactNode {
  if (!followedByList) return renderInline(text);

  const match = text.match(/^(.{1,80}?):\s*$/);
  if (!match || match[1].split(/\s+/).length > 12) return renderInline(text);

  return (
    <>
      <strong>{renderInline(match[1])}</strong>:
    </>
  );
}

export function ArticleContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = (nextLineIndex: number) => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (!text) {
      paragraph = [];
      return;
    }

    const nextNonEmpty = lines.slice(nextLineIndex).find((line) => line.trim());
    const followedByList = !!nextNonEmpty && /^\s*(?:[-*]|\d+\.)\s+/.test(nextNonEmpty);

    blocks.push(
      <p key={`p-${blocks.length}`} className="my-0 text-[1.05rem] leading-8 text-[#37445a] sm:text-lg sm:leading-9">
        {autoLeadIn(text, followedByList)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const current = list;
    blocks.push(
      current.ordered ? (
        <ol key={`ol-${blocks.length}`} className="my-8 list-decimal space-y-3 pl-7 text-[1.05rem] leading-8 text-[#37445a] sm:text-lg sm:leading-9">
          {current.items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </ol>
      ) : (
        <ul key={`ul-${blocks.length}`} className="my-8 list-disc space-y-3 pl-7 text-[1.05rem] leading-8 text-[#37445a] sm:text-lg sm:leading-9">
          {current.items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </ul>
      ),
    );
    list = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      flushParagraph(i + 1);
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(i);
      flushList();
      const level = heading[1].length;
      const className =
        level === 1
          ? "mt-14 mb-5 font-serif text-3xl leading-tight text-[#172845] sm:text-4xl"
          : level === 2
            ? "mt-12 mb-5 font-serif text-2xl leading-tight text-[#172845] sm:text-3xl"
            : "mt-10 mb-4 font-serif text-xl font-semibold leading-tight text-[#172845] sm:text-2xl";
      const HeadingTag = level === 1 ? "h2" : level === 2 ? "h2" : "h3";
      blocks.push(
        <HeadingTag key={`h-${blocks.length}`} className={className}>
          {renderInline(heading[2])}
        </HeadingTag>,
      );
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph(i);
      const isOrdered = !!ordered;
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push((unordered ?? ordered)![1]);
      continue;
    }

    if (list) flushList();
    paragraph.push(line);
  }

  flushParagraph(lines.length);
  flushList();

  return <div className="space-y-7">{blocks}</div>;
}

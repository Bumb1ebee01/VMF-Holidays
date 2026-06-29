import { Fragment, type ReactNode } from "react";
import styles from "./PostBody.module.css";

// Renders the admin's post content. Supported, deliberately simple markup:
//   • blank line              → new paragraph
//   • line starting "# "      → H2 heading   ("## " → H3)
//   • line starting "- "      → bullet list item
//   • [label](/path) or [label](https://…) → link
// Links are restricted to internal ("/") or https URLs; anything else is rendered
// as plain text, so admin input still can't inject arbitrary markup or unsafe
// schemes (e.g. javascript:).

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

function parse(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h3", text: line.slice(3).trim() });
    } else if (line.startsWith("# ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(2).trim() });
    } else {
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

// Turn inline [label](href) into anchors, leaving the rest as text. A fresh regex
// per call avoids the global-regex lastIndex statefulness across renders.
function renderInline(text: string): ReactNode {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    const [full, label, href] = m;
    if (m.index > last) {
      nodes.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    }
    const external = href.startsWith("https://");
    if (href.startsWith("/") || external) {
      nodes.push(
        <a key={key++} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      );
    } else {
      // Unsupported scheme — render the original text rather than a link.
      nodes.push(<Fragment key={key++}>{full}</Fragment>);
    }
    last = m.index + full.length;
  }
  if (nodes.length === 0) return text;
  if (last < text.length) nodes.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return nodes;
}

export default function PostBody({ content }: { content: string }) {
  const blocks = parse(content);
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{renderInline(block.text)}</h2>;
        if (block.type === "h3") return <h3 key={i}>{renderInline(block.text)}</h3>;
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

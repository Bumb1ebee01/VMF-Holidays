import styles from "./PostBody.module.css";

// Renders the admin's post content. Supported, deliberately simple markup:
//   • blank line          → new paragraph
//   • line starting "# "  → H2 heading   ("## " → H3)
//   • line starting "- "  → bullet list item
// No raw HTML is rendered, so admin input can't inject markup.

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

export default function PostBody({ content }: { content: string }) {
  const blocks = parse(content);
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}

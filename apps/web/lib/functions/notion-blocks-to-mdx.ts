function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/([{}])/g, "\\$1")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeLinkDestination(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\)/g, "\\)");
}

function richTextToMdx(richText: any[] = []) {
  return richText
    .map((item) => {
      const annotations = item.annotations ?? {};
      const plainText = escapeText(item.plain_text ?? item.text?.content ?? "");
      let text = plainText;

      if (annotations.code) text = `\`${text.replace(/`/g, "\\`")}\``;
      if (annotations.bold) text = `**${text}**`;
      if (annotations.italic) text = `*${text}*`;
      if (annotations.strikethrough) text = `~~${text}~~`;
      if (annotations.underline) text = `<u>${text}</u>`;
      if (item.href) text = `[${text}](${escapeLinkDestination(item.href)})`;

      return text;
    })
    .join("");
}

function indent(value: string, prefix = "  ") {
  return value
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : line))
    .join("\n");
}

function codeFence(value: string) {
  const longestFence = Math.max(
    2,
    ...Array.from(value.matchAll(/`+/g), (match) => match[0].length),
  );
  return "`".repeat(longestFence + 1);
}

function blockToMdx(block: any, listDepth = 0): string {
  const type = block?.type;
  const value = block?.[type] ?? {};
  const text = richTextToMdx(value.rich_text);
  const children = Array.isArray(block?.children)
    ? blocksToMdx(block.children, listDepth + 1)
    : "";

  switch (type) {
    case "paragraph":
      return [text, children].filter(Boolean).join("\n\n");
    case "heading_1":
      return `# ${text}`;
    case "heading_2":
      return `## ${text}`;
    case "heading_3":
      return `### ${text}`;
    case "bulleted_list_item":
      return `${"  ".repeat(listDepth)}- ${text}${children ? `\n${indent(children)}` : ""}`;
    case "numbered_list_item":
      return `${"  ".repeat(listDepth)}1. ${text}${children ? `\n${indent(children)}` : ""}`;
    case "to_do":
      return `${"  ".repeat(listDepth)}- [${value.checked ? "x" : " "}] ${text}${children ? `\n${indent(children)}` : ""}`;
    case "quote":
      return [text, children]
        .filter(Boolean)
        .join("\n\n")
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    case "callout": {
      const emoji = value.icon?.emoji ? `${value.icon.emoji} ` : "";
      return [
        `> ${emoji}${text}`,
        children ? `>\n${indent(children, "> ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "toggle":
      return `<details>\n<summary>${text}</summary>\n\n${children}\n\n</details>`;
    case "divider":
      return "---";
    case "code": {
      const code = (value.rich_text ?? [])
        .map((item: any) => item.plain_text ?? item.text?.content ?? "")
        .join("");
      const fence = codeFence(code);
      const language =
        value.language === "plain text" ? "" : (value.language ?? "");
      return `${fence}${language}\n${code}\n${fence}`;
    }
    case "image": {
      const url =
        value.type === "external" ? value.external?.url : value.file?.url;
      const caption = richTextToMdx(value.caption);
      return url
        ? `![${caption || "Image"}](${escapeLinkDestination(url)})`
        : "";
    }
    case "bookmark":
      return value.url
        ? `[${escapeText(value.url)}](${escapeLinkDestination(value.url)})`
        : "";
    default:
      return children;
  }
}

export function blocksToMdx(blocks: any[], listDepth = 0) {
  return blocks
    .map((block) => blockToMdx(block, listDepth))
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

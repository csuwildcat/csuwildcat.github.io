import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

type DirectiveAttributes = Record<string, string | null | undefined>;

type HastNode =
  | {
      type: "element";
      tagName: string;
      properties?: Record<string, unknown>;
      children?: HastNode[];
    }
  | {
      type: "text";
      value: string;
    };

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: DirectiveAttributes | null;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
    hChildren?: HastNode[];
  };
  children?: DirectiveNode[];
};

const IMAGE_DIRECTIVE_NAMES = new Set(["image", "img"]);

const getAttr = (
  attrs: DirectiveAttributes | null | undefined,
  ...keys: string[]
) => {
  for (const key of keys) {
    const value = attrs?.[key];
    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }
  return undefined;
};

const normalizeCssSize = (value: string | undefined) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    return `${trimmed}px`;
  }
  return trimmed;
};

const splitClasses = (value: string | undefined) =>
  value ? value.split(/\s+/).filter(Boolean) : [];

export default function remarkImageDirective() {
  return (tree: unknown) => {
    visit(tree as DirectiveNode, "leafDirective", node => {
      if (!IMAGE_DIRECTIVE_NAMES.has(node.name ?? "")) {
        return;
      }

      const attrs = node.attributes ?? {};
      const src = getAttr(attrs, "src", "url", "href");
      if (!src) {
        return;
      }

      const label = toString(node).trim();
      const alt = getAttr(attrs, "alt") ?? label;
      const caption = getAttr(attrs, "caption", "figcaption");
      const maxWidth = normalizeCssSize(
        getAttr(attrs, "maxWidth", "max-width", "mw")
      );

      const figureClasses = [
        "content-image",
        ...splitClasses(getAttr(attrs, "class", "className")),
      ];

      const figureProps: Record<string, unknown> = {
        className: figureClasses,
      };
      if (maxWidth) {
        figureProps.style = `max-width:${maxWidth};`;
      }

      const imgProps: Record<string, unknown> = {
        src,
        alt: alt ?? "",
      };

      const title = getAttr(attrs, "title");
      if (title) imgProps.title = title;

      const loading = getAttr(attrs, "loading");
      if (loading) imgProps.loading = loading;

      const decoding = getAttr(attrs, "decoding");
      if (decoding) imgProps.decoding = decoding;

      const width = getAttr(attrs, "width");
      if (width) imgProps.width = width;

      const height = getAttr(attrs, "height");
      if (height) imgProps.height = height;

      const imgClass = splitClasses(getAttr(attrs, "imgClass", "img-class"));
      if (imgClass.length > 0) {
        imgProps.className = imgClass;
      }

      const children: HastNode[] = [
        {
          type: "element",
          tagName: "img",
          properties: imgProps,
          children: [],
        },
      ];

      if (caption) {
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: caption }],
        });
      }

      const data = node.data ?? (node.data = {});
      data.hName = "figure";
      data.hProperties = figureProps;
      data.hChildren = children;

      node.children = [];
    });
  };
}

import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

type DirectiveAttributes = Record<string, string | null | undefined>;

type TextNode = {
  type: "text";
  value: string;
};

type ParagraphNode = {
  type: "paragraph";
  children?: MdastNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

type ImageNode = {
  type: "image";
  url: string;
  alt?: string | null;
  title?: string | null;
  data?: {
    hProperties?: Record<string, unknown>;
  };
};

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: DirectiveAttributes | null;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
    hChildren?: unknown[];
  };
  children?: MdastNode[];
};

type MdastNode = DirectiveNode | ImageNode | ParagraphNode | TextNode;

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

const isTruthyAttr = (value: string | undefined) => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

const normalizeAssetSrc = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("/src/assets/")) {
    return `@/assets/${trimmed.slice("/src/assets/".length)}`;
  }
  if (trimmed.startsWith("src/assets/")) {
    return `@/assets/${trimmed.slice("src/assets/".length)}`;
  }
  return trimmed;
};

export default function remarkImageDirective() {
  return (tree: unknown) => {
    visit(tree as DirectiveNode, node => {
      if (!IMAGE_DIRECTIVE_NAMES.has(node.name ?? "")) {
        return;
      }

      const attrs = node.attributes ?? {};
      const rawSrc = getAttr(attrs, "src", "url", "href");
      const src = rawSrc ? normalizeAssetSrc(rawSrc) : undefined;
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

      const title = getAttr(attrs, "title");

      const loading = getAttr(attrs, "loading");

      const decoding = getAttr(attrs, "decoding");

      const width = getAttr(attrs, "width");

      const height = getAttr(attrs, "height");

      const imgClass = splitClasses(getAttr(attrs, "imgClass", "img-class"));
      const disableImageZoom = isTruthyAttr(
        getAttr(
          attrs,
          "data-no-zoom",
          "noZoom",
          "no-zoom",
          "data-disable-image-zoom",
          "disableImageZoom",
          "disable-image-zoom"
        )
      );
      const imgProps: Record<string, unknown> = {};
      if (loading) imgProps.loading = loading;
      if (decoding) imgProps.decoding = decoding;
      if (width) imgProps.width = width;
      if (height) imgProps.height = height;
      if (imgClass.length > 0) imgProps.className = imgClass;
      if (disableImageZoom) {
        figureProps["data-no-zoom"] = "true";
        imgProps["data-no-zoom"] = "true";
      }

      const imageNode: ImageNode = {
        type: "image",
        url: src,
        alt: alt ?? "",
        title: title ?? null,
      };
      if (Object.keys(imgProps).length > 0) {
        imageNode.data = { hProperties: imgProps };
      }

      const children: MdastNode[] = [imageNode];

      if (caption) {
        children.push({
          type: "paragraph",
          data: { hName: "figcaption" },
          children: [{ type: "text", value: caption }],
        });
      }

      const data = node.data ?? (node.data = {});
      data.hName = "figure";
      data.hProperties = figureProps;

      if ("hChildren" in data) {
        delete data.hChildren;
      }
      node.children = children;
    });
  };
}

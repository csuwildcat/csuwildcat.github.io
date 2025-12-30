import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  data?: {
    directiveLabel?: boolean;
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
  children?: DirectiveNode[];
  value?: string;
};

const DEFAULT_LABEL = "Show All";

export default function remarkContentCollapse() {
  return (tree: unknown) => {
    visit(tree as DirectiveNode, "containerDirective", node => {
      const directive = node as DirectiveNode;
      if (directive.name !== "collapse") {
        return;
      }

      const attrs = directive.attributes ?? {};
      const data = directive.data ?? (directive.data = {});
      data.hName = "div";
      data.hProperties ??= {};

      const className = data.hProperties.className;
      if (Array.isArray(className)) {
        className.push("content-collapse");
      } else if (typeof className === "string") {
        data.hProperties.className = [className, "content-collapse"];
      } else {
        data.hProperties.className = ["content-collapse"];
      }

      const height =
        attrs.height || attrs["max-height"] || attrs.maxHeight || undefined;
      if (height) {
        data.hProperties["data-collapse-height"] = height;
      }

      const labelAttr = attrs.label || attrs["expand-label"];
      const collapseLabelAttr = attrs["collapse-label"];
      const openAttr = attrs.open ?? attrs.expanded ?? attrs["start-open"];

      if (labelAttr) {
        data.hProperties["data-collapse-label"] = labelAttr;
      }
      if (collapseLabelAttr) {
        data.hProperties["data-collapse-collapse-label"] = collapseLabelAttr;
      }
      if (openAttr !== undefined) {
        data.hProperties["data-collapse-open"] = String(openAttr);
      }

      let labelText = DEFAULT_LABEL;
      if (directive.children && directive.children.length > 0) {
        const firstChild = directive.children[0];
        if (firstChild.type === "paragraph" && firstChild.data?.directiveLabel) {
          const label = toString(firstChild).trim();
          if (label) {
            labelText = label;
          }
          directive.children.shift();
        }
      }

      if (!labelAttr && labelText) {
        data.hProperties["data-collapse-label"] = labelText;
      }
    });
  };
}

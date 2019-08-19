declare module "remark-toc" {
  const toc: import("unified").Plugin;
  export = toc;
}

declare module "unist-util-visit" {
  function visit(
    tree: import("unist").Node,
    type: string,
    visitor: (node: import("unist").Node) => void,
  ): void;
  export = visit;
}

declare module "shell-split" {
  export function split(str: string): string[];
}

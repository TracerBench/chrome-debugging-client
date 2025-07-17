declare module "remark-toc" {
  const toc: import("unified").Plugin;
  export = toc;
}

declare module "shell-split" {
  export function split(str: string): string[];
}

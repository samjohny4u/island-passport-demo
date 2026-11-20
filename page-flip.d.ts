declare module "page-flip" {
  export class PageFlip {
    constructor(el: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: "flip" | "changeState" | "init", cb: (e: { data: unknown }) => void): this;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(i: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    destroy(): void;
  }
}

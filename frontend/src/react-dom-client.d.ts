// Fix for React 19 type declarations
declare module "react-dom/client" {
  import { ReactNode } from "react";

  interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}

declare namespace JSX {
  type Element = unknown;
  interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }
}

declare module 'react/jsx-runtime' {
  export const Fragment: symbol;
  export function jsx(type: unknown, props: Record<string, unknown>, key?: string): JSX.Element;
  export function jsxs(type: unknown, props: Record<string, unknown>, key?: string): JSX.Element;
}

declare module 'react/jsx-dev-runtime' {
  export const Fragment: symbol;
  export function jsxDEV(
    type: unknown,
    props: Record<string, unknown>,
    key: string | undefined,
    isStaticChildren: boolean,
    source: unknown,
    self: unknown
  ): JSX.Element;
}

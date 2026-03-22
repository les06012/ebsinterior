declare namespace React {
  type Key = string | number;
  type ReactText = string | number;
  type ReactNode = ReactText | boolean | null | undefined | JSX.Element | ReactNode[];

  interface Attributes {
    key?: Key;
  }

  interface RefObject<T> {
    readonly current: T | null;
  }

  interface MutableRefObject<T> {
    current: T;
  }

  type SetStateAction<S> = S | ((prevState: S) => S);
  type Dispatch<A> = (value: A) => void;

  interface SyntheticEvent<T = Element, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
  }

  interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {}
  interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {}
  interface MouseEvent<T = Element> extends SyntheticEvent<T, globalThis.MouseEvent> {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    button: number;
  }
}

declare module 'react' {
  export import Key = React.Key;
  export import ReactText = React.ReactText;
  export import ReactNode = React.ReactNode;
  export import Attributes = React.Attributes;
  export import RefObject = React.RefObject;
  export import MutableRefObject = React.MutableRefObject;
  export import SetStateAction = React.SetStateAction;
  export import Dispatch = React.Dispatch;
  export import SyntheticEvent = React.SyntheticEvent;
  export import FormEvent = React.FormEvent;
  export import ChangeEvent = React.ChangeEvent;
  export import MouseEvent = React.MouseEvent;

  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useRef<T>(initialValue: T | null): React.MutableRefObject<T | null>;

  export function createElement(type: unknown, props?: Record<string, unknown> | null, ...children: React.ReactNode[]): JSX.Element;

  export function memo<P>(component: (props: P) => JSX.Element): (props: P) => JSX.Element;

  export const Fragment: symbol;
  export function StrictMode(props: { children?: React.ReactNode }): JSX.Element;

  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof useMemo;
    useRef: typeof useRef;
    createElement: typeof createElement;
    memo: typeof memo;
    Fragment: typeof Fragment;
    StrictMode: typeof StrictMode;
  };

  export default React;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: unknown): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}

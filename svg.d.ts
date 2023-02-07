declare module '*.svg' {
  const content: React.FunctionComponent<
    React.SVGAttributes<SVGElement> & {
      onPress?: (() => void) | null | undefined;
    }
  >;

  export default content;
}

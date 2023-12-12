type Props = {
  class?: string;
  children: any;
  [string: string]: any;
};

export default function PinkButton({
  class: className,
  children,
  ...rest
}: Props) {
  return (
    <button
      class={`bg-red-400 hover:bg-red-400 text-red-100 flex cursor-pointer items-center justify-center gap-3 rounded-md border-none px-4 py-2 text-base font-bold shadow-md hover:text-white ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

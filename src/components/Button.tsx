type Props = {
  class?: string;
  children: any;
  [string: string]: any;
};

export default function Button({ class: className, children, ...rest }: Props) {
  return (
    <button
      class={`flex cursor-pointer items-center justify-center gap-3 rounded-md border-none bg-blue-300 px-4 py-2 text-base font-bold text-slate-900 shadow-md hover:bg-blue-400 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

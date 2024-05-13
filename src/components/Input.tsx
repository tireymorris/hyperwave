export default function Input({ class: className, placeholder, ...rest }) {
  return (
    <input
      type="text"
      placeholder={placeholder || "..."}
      class={`border-gray-2 h-8 rounded-md border border-solid bg-transparent py-1 pl-3 pr-10 text-sm text-neutral-500 focus:border-blue-200 ${
        className || ""
      }`}
      autocomplete="off"
      spellcheck="false"
      dir="auto"
      {...rest}
    />
  );
}

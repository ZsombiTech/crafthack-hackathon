const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:z-10 text-sm placeholder:text-sm";

interface InputProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  isRequired?: boolean;
  placeholder: string;
  customClass?: string;
}

export default function Input({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
}: InputProps) {
  return (
    <div className="my-2">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      <input
        onChange={handleChange}
        value={value}
        id={id}
        name={name}
        type={type}
        required={isRequired}
        className={fixedInputClass + customClass}
        placeholder={placeholder}
      />
    </div>
  );
}

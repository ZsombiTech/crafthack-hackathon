const fixedInputClass =
  "rounded-lg appearance-none relative border border-primary block w-full px-2 py-3 placeholder-white text-white focus:outline-0 focus:z-10 text-sm placeholder:text-sm bg-dark-light";

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
  customClass = "",
}: InputProps) {
  return (
    <div className="my-6">
      <label htmlFor={labelFor} className="sr-only bg-gray-800">
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

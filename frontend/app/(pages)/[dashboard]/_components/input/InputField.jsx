import React from "react";

const Input = ({
  label,
  id,
  register,
  errors,
  type = "text",
  placeholder,
  options,
  defaultValue, // Añadido para manejar valores predeterminados
}) => {
  const isSelect = type === "select";

  return (
    <div className="grid w-full items-center gap-1.5">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
      {isSelect ? (
        <select
          id={id}
          name={id}
          {...register(id, {
            required: `The ${label} is required.`,
          })}
          defaultValue={defaultValue} // Usar valor predeterminado
          className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 ${
            errors[id] ? "border-red-500 bg-red-100" : "border-gray-300"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          {...register(id, {
            required: `The ${label} is required.`,
          })}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue} // Usar valor predeterminado
          className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 ${
            errors[id] ? "border-red-500 bg-red-100" : "border-gray-300"
          }`}
        />
      )}
      {errors[id] && (
        <p className="mt-1 text-sm text-red-500">{errors[id].message}</p>
      )}
    </div>
  );
};

export default Input;

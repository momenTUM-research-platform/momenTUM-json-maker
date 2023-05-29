import React from "react";

interface CheckboxWidgetProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({
  id,
  label,
  value,
  onChange,
}) => (
  <label className="py-5" htmlFor={id}>
    <input
      id={id}
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />

    <span className="px-5">{label}</span>
  </label>
);

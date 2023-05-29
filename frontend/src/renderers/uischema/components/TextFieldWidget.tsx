interface TextFieldWidgetProps {
  id: string;
  placeholder?: string;
}

export const TextFieldWidget: React.FC<TextFieldWidgetProps> = ({
  id,
  placeholder,
}) => (
  <input
    id={id}
    className="border border-gray-300 rounded-md p-2"
    type="text"
    placeholder={placeholder}
  />
);

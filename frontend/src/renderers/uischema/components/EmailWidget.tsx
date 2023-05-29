
interface EmailWidgetProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
  }
  
  export const EmailWidget: React.FC<EmailWidgetProps> = ({
    id,
    value,
    onChange,
  }) => (
    <input
      id={id}
      className="border border-gray-300 rounded-md p-2"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  
  
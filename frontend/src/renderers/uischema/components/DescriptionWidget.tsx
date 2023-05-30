import React from "react";

interface DescriptionWidgetProps {
  description: string;
}

const DescriptionWidget: React.FC<DescriptionWidgetProps> = ({
  description,
}) => {
  return (
    <p className="font-sans font-light text-gray-500 whitespace-normal text-[12px] dark:text-gray-500">
      {description}
    </p>
  );
};

export default DescriptionWidget;


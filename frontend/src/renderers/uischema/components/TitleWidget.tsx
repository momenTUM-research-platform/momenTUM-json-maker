import React from "react";

interface TitleWidgetProps {
  Title: string;
}

const TitleWidget: React.FC<TitleWidgetProps> = ({
  Title,
}) => {
  return <div className="text-md">{Title}</div>;
};

export default TitleWidget;

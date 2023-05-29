import React from "react";

interface TitleWidgetProps {
  Title: string;
}

const TitleWidget: React.FC<TitleWidgetProps> = ({
  Title,
}) => {
  return <div className="text-[14px]">{Title}</div>;
};

export default TitleWidget;

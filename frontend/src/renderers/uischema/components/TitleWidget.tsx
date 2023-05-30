import React from "react";

interface TitleWidgetProps {
  Title: string;
}

const TitleWidget: React.FC<TitleWidgetProps> = ({ Title }) => {
  return (
    <h1 className="whitespace-normal text-[22px] ">
      {Title}
      <hr></hr>
    </h1>
  );
};

export default TitleWidget;

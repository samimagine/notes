import { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-400 text-white text-xs py-1 px-3 rounded shadow-md whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

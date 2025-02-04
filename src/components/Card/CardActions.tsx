import { FaTrash, FaEdit, FaCopy } from "react-icons/fa";
import Tooltip from "../common/Tooltip";

interface CardActionsProps {
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const CardActions = ({ onEdit, onCopy, onDelete }: CardActionsProps) => {
  return (
    <div className="flex justify-between items-center w-auto absolute bottom-2 left-4 right-4">
      <div className="flex space-x-3 text-gray-500">
        <Tooltip text="Edit Note">
          <button onClick={onEdit}>
            <FaEdit className="cursor-pointer hover:text-blue-500" />
          </button>
        </Tooltip>
        <Tooltip text="Copy Content">
          <button onClick={onCopy}>
            <FaCopy className="cursor-pointer hover:text-purple-500" />
          </button>
        </Tooltip>
      </div>
      <Tooltip text="Delete Note">
        <button onClick={onDelete}>
          <FaTrash className="cursor-pointer text-red-500 hover:text-red-700" />
        </button>
      </Tooltip>
    </div>
  );
};

export default CardActions;

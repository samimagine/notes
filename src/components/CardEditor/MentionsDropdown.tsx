interface MentionsDropdownProps {
  mentionResults: { username: string }[];
  selectedIndex: number;
  onSelect: (username: string) => void;
}

const MentionsDropdown = ({
  mentionResults,
  selectedIndex,
  onSelect,
}: MentionsDropdownProps) => {
  return (
    <ul className="bg-white border shadow-md absolute z-10">
      {mentionResults.map((user, index) => (
        <li
          key={user.username}
          className={`p-2 cursor-pointer ${
            index === selectedIndex
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => onSelect(user.username)}
        >
          @{user.username}
        </li>
      ))}
    </ul>
  );
};

export default MentionsDropdown;

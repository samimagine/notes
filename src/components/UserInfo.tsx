import React from "react";
import { User } from "../interfaces/UserInterface";

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">@{user.username}</h2>
      <div className="space-y-2">
        <p className="text-lg">
          <strong>{user.title}</strong> {user.first_name} {user.last_name}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
        <p>
          <strong>Location:</strong> {user.location.city}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;

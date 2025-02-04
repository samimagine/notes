import { useState, useEffect } from "react";
import { User } from "../interfaces/UserInterface";

const API_USERS_URL = "https://challenge.surfe.com/users";

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_USERS_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const findUserByUsername = (username: string) =>
    users.find((user) => user.username === username) || null;

  return { users, findUserByUsername };
};

export default useUsers;

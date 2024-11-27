'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem('PUID');
      if (userId) {
        const url = 'http://localhost/pets-app/api/user.php';
        const jsonData = { userId: userId };

        const formData = new FormData();
        formData.append("operation", "getCurrentUser");
        formData.append("json", JSON.stringify(jsonData));

        let response = await axios({
          url: url,
          method: "POST",
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const data = response.data;
        setUser(data);
      }
    };

    fetchUserData();
  }, [pathname]); 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

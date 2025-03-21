import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FunctionComponent,
} from "react";
import { User } from "../interfaces/Users/User";
import { decodeToken } from "../services/tokenService";
import { CustomJwtPayload } from "../interfaces/Users/CustomJwtPayload";
import { getUserbyId } from "../services/userService";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    const cleanToken = decodeToken(token) as CustomJwtPayload;
    getUserbyId(cleanToken._id)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      login(token);
    } else {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

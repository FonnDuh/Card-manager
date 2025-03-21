import { FunctionComponent, memo } from "react";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/Users/User";

interface NavbarLinksProps {
  user: User | null;
}

const NavbarLinks: FunctionComponent<NavbarLinksProps> = ({ user }) => {
  return (
    <div className="navbar-nav me-auto">
      <Link className="custom-btn" to="/about">
        About
      </Link>
      {user && (
        <>
          <Link className="custom-btn" to="/favorites">
            Favorites
          </Link>
          {(user.isAdmin || user.isBusiness) && (
            <Link className="custom-btn" to="/my-cards">
              My Cards
            </Link>
          )}
          {user.isAdmin && (
            <Link className="custom-btn" to="/CRM">
              CRM
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default memo(NavbarLinks);

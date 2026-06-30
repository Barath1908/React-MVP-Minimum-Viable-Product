import useAuth from "../../../modules/auth/hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <span>Welcome, {user?.first_name || "User"}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default Header;
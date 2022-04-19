import logo from '../images/logo.svg';

function Header() {
  return (
    <header className="header">
      <img className="logo" src={logo} id="logo-icon" alt="logo"></img>
    </header>
  );
}

export default Header;

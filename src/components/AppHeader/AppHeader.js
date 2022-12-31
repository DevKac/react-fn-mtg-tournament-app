import { Link } from 'react-router-dom';

const AppHeader = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
       <Link className="navbar-brand"  to="/">MTG Tournament App</Link>
      </div>
    </nav>
  );
};

export default AppHeader;

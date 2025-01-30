import PropTypes from 'prop-types';

function Navbar({ onLoginClick, onRegisterClick }) {
    return (
      <div>
        <header>
          <div className="logo-text">
            <img src="jaypee_main_logo.jpeg" className="logo"  />
            <h1>Jaypee Learning Hub</h1>
          </div>
        </header>
        <nav className="navb">
          <div className="nav-bar">
            <div className="login-but">
              <a href="#" className="login-button" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Login</a>
            </div>
            <div className="register-but">h 
              <a href="#" id="show-register" onClick={(e) => { e.preventDefault(); onRegisterClick(); }}>Register</a>
            </div>
          </div>
        </nav>
      </div>
    );
}


Navbar.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired
};

export default Navbar;



  
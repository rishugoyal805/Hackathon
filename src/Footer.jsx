
const Footer = () => {
    const openGmail = (email) => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    };

    return (
        <footer>
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-item">
                        <div className="footer-profile">
                            <img src="./profile.jpg" alt="Profile Image 1" className="profile-image" />
                            <div className="footer-details">
                                <h4>Swayam Gupta</h4>
                                <div>
                                    <p>Email:&nbsp;
                                        <a href="#" onClick={() => openGmail('swayamsam2005@gmail.com')}>E-mail</a>
                                    </p>
                                </div>
                                <ul>
                                    <li><a href="https://www.linkedin.com/in/swayamgupta12" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                                    <li><a href="https://github.com/SwayamGupta12345" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-item">
                        <div className="footer-profile">
                            <img src="profile1.jpg" alt="Profile Image 2" className="profile-image" />
                            <div className="footer-details">
                                <h4>Rishu Goyal</h4>
                                <div>
                                    <p>Email:&nbsp;
                                        <a href="#" onClick={() => openGmail('rishugoyal16800@gmail.com')}>E-mail</a>
                                    </p>
                                </div>
                                <ul>
                                    <li><a href="https://www.linkedin.com/in/rishu0405" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                                    <li><a href="https://github.com/rishugoyal805" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Made by: Swayam Gupta, Rishu Goyal</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
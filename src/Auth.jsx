import { useState } from 'react';
import './Auth.css';
import Navbar from './Navbar';
import Announce from './Announce';
import Footer from './footer';
import axios from 'axios';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [message, setMessage] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const validateEmail = (email) => {
        const collegeEmailRegex = /^((2[1-4](([1-9])[0|1]([1-4]|[8|9])|8[0][1-3])[0-9]{3}|99(2[1-4](1[0][1-4])[0-9]{3})|9924[0-1]1[0|2][1|3|4]0[0-9]{3}|24[0-1][1-9][0-2]([0-3]|7|8|9)0[0-9]{3}))@mail\.jiit\.ac\.in$/;
        return collegeEmailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setMessage('Please enter a valid college email');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/auth', { email, password });
            console.log('Login request sent:', { email, password }); // Log the sent data
            console.log('Response from server:', res.data); // Log the response from the server
            localStorage.setItem('token', res.data.token);
            if (res.data.isAdmin) {
                setMessage('Welcome Admin');
            } else if (res.data.isUser) {
                setMessage('Welcome User');
            } else {
                setMessage('Login Successful');
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Authentication failed');
        }
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateEmail(regEmail)) {
            setMessage('Please enter a valid college email (e.g., user@college.edu).');
            return;
        }
        if (!validatePassword(regPassword)) {
            setMessage('Password must be at least 8 characters long, include uppercase, lowercase, a digit, and a special character.');
            return;
        }
        if (secret.length < 3) {
            setMessage('Secret string must be at least 3 characters long.');
            return;
        }
    
        try {
            const registerData = { email: regEmail, password: regPassword, secret };
            console.log('Registration request sent:', registerData); // Log the sent data
            const res = await axios.post('http://localhost:5000/register', registerData);
            console.log('Response from server:', res.data); // Log the response from the server
            setMessage('Registration successful! You can now log in.');
            setShowRegister(false);
            setShowLogin(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
        }
    };
    

    return (
        <div>
            <Navbar onLoginClick={() => { setShowLogin(true); setShowRegister(false); }} onRegisterClick={() => { setShowRegister(true); setShowLogin(false); }} /> 
            <Announce/>
            {showRegister && (
                <div className="flex-col register-form active" id="register-form">
                    <button className="close-button" onClick={() => setShowRegister(false)}>&times;</button>
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <input 
                            type="email" 
                            name="reg_email" 
                            placeholder="College Email" 
                            value={regEmail} 
                            onChange={(e) => setRegEmail(e.target.value)} 
                            required 
                        />
                        <p className="special-string-info" style={{ fontSize: '11px'}}>
                            <ul>
                                <li>Password must be at least 8 characters long</li>
                                <li>Include an Uppercase letter</li>
                                <li>Include a Lowercase letter</li>
                                <li>Include a Digit</li>
                                <li>Include a Special Character</li>
                            </ul>
                        </p>
                        <input 
                            type="password" 
                            name="reg_password" 
                            placeholder="Create Password" 
                            value={regPassword} 
                            onChange={(e) => setRegPassword(e.target.value)} 
                            required 
                        />
                        <p className="special-string-info"><b>Enter a special string that you will remember.</b></p>
                        <input 
                            type="text" 
                            name="secret" 
                            placeholder="Your Pet's name or something" 
                            value={secret} 
                            onChange={(e) => setSecret(e.target.value)} 
                            required 
                        />
                        <button type="submit">Register</button>
                    </form>
                    <p className='last-para'>Remember your username and password? <a href="#" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Dont worry, login!</a></p>
                    <div id="register-message">{message}</div>
                </div>
            )}
            {showLogin && (
                <div className="flex-col login-form active" id="login-form">
                    <button className="close-button" onClick={() => setShowLogin(false)}>&times;</button>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="email"
                            placeholder="College Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p>Not a user? <a href="#" onClick={() => { setShowRegister(true); setShowLogin(false); }}>Register here!</a></p>
                    <div id="message">{message}</div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default Auth;



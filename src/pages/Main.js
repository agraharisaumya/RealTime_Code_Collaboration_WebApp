import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { useNavigate } from 'react-router-dom';


const Main = () => {
    const container = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('./Animation - 1711999006454.json'),
        });
    }, []);

    return (
        <div className="mainContainer">
            {/* Top Navigation Bar */}
            <div className="topNav">
                {/* Left Logo */}
                <img src="Logo.png" alt="SynCode Logo" className="main_logo" />

                {/* Right-side Buttons */}
                <div className="authButtons">
                    <button onClick={() => navigate('/login')} className="btn loginBtn">Login</button>
                    <button onClick={() => navigate('/signup')} className="btn signupBtn">Signup</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="header">
                <div className="header_text">
                    <h1>INTRODUCING: <span>SynCode</span></h1>
                    <p>
                        Revolutionize teamwork with SynCode, a real-time web-based code editor like Google Docs.
                        Empower multiple developers to collaborate seamlessly on the same codebase, fostering instant feedback & unparalleled efficiency.
                    </p>

                    {/* Try SynCode Button */}
                    <button onClick={() => navigate('/home')} className="btn trybtn">Let's try SynCode</button>
                </div>
                <div className="header_img">
                    <div className="container" ref={container}></div>
                </div>
            </div>
        </div>
    );
};

export default Main;

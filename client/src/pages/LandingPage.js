import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import '../components/styles/LandingPage.css'; 

gsap.registerPlugin(TextPlugin);

const LandingPage = () => {
  const history = useHistory();

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const readyMessageRef = useRef(null);
  const signUpButtonRef = useRef(null);
  const alreadyHaveAccountRef = useRef(null);
  const loginButtonRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(cardRef.current, 
      { opacity: 0, y: 50 },  
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }  
    );

    timeline.fromTo(titleRef.current, 
      { opacity: 0, x: -50 },  
      { opacity: 1, x: 0, duration: 1.5, ease: "power4.out", delay: 0.5 }  
    );

    timeline.to(descriptionRef.current, {
      text: "Your one-stop solution for managing tasks efficiently.",
      duration: 3,
      ease: "none",
      delay: 0.5,  
    });

    timeline.fromTo(readyMessageRef.current, 
      { opacity: 0, scale: 0.8 },  
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 0.5 }  
    );

    timeline.fromTo(signUpButtonRef.current, 
      { opacity: 0, scale: 0.8 },  
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 0.2 }  
    );

    timeline.fromTo(alreadyHaveAccountRef.current, 
      { opacity: 0 },  
      { opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }  
    );

    timeline.fromTo(loginButtonRef.current, 
      { opacity: 0, scale: 0.8 },  
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 0.2 }  
    );

  }, []);

  const handleSignUp = () => {
    history.push('/signup');
  };

  const handleLogin = () => {
    history.push('/login');
  };

  return (
    <div className="landing-page">
      <div className="card" ref={cardRef}>
        <h1 className='welcome' ref={titleRef}>
          Welcome to <br></br> <span>TaskMaster</span>
        </h1>
        <p className='description' ref={descriptionRef}></p>
        <div className="button-group">
          <p className='ready' ref={readyMessageRef}>Ready to start your task management journey?</p> 
          <button className="sign-up-button" ref={signUpButtonRef} onClick={handleSignUp}>Sign Up</button>
          <p className='already' ref={alreadyHaveAccountRef}>Already have an account?</p>
          <button className="login-button" ref={loginButtonRef} onClick={handleLogin}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

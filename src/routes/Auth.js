import React, { useState, useRef, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { authService } from "fbase";

const Auth = () => {
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(true);
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (isNewAccount) {
      // create Account
      createUserWithEmailAndPassword(
        authService(),
        emailRef.current?.value,
        pwRef.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          console.log("error:", error);
          alert(error.message);
        });
    } else {
      // login
      signInWithEmailAndPassword(
        authService(),
        emailRef.current.value,
        pwRef.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("user in signin:", user);
          // ...
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  };
  const toggleAccount = () => setIsNewAccount((prev) => !prev);
  const socialLogin = (e) => {
    const { name } = e.target;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    signInWithPopup(authService(), provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //   const credential = GoogleAuthProvider.credentialFromResult(result);
        //   const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("result:", result);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log("error:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          ref={emailRef}
          onChange={onChange}
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          required
        />
        <input
          ref={pwRef}
          onChange={onChange}
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          required
        />
        <span onClick={toggleAccount}>
          {isNewAccount ? "Sign In" : "Create New"}
        </span>
        <input
          type="submit"
          value={isNewAccount ? "Create Account" : "Log In"}
        />
      </form>
      <div>
        <button name="google" onClick={socialLogin}>
          Continue with Google
        </button>
        <button name="github" onClick={socialLogin}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;

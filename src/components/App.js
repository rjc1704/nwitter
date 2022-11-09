import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const auth = authService();
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);

  const refreshUserObj = () => {
    setUserObj(Object.assign({}, auth.currentUser));
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
    return () => {
      setInit(false);
    };
  }, []);

  return (
    <>
      {init ? (
        <AppRouter
          refreshUserObj={refreshUserObj}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Connecting Firebase..."
      )}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;

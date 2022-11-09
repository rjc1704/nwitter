import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { query, where, collection, getDocs, orderBy } from "firebase/firestore";

import { getAuth, signOut, updateProfile } from "firebase/auth";
import { dbService } from "fbase";
const Profile = ({ userObj, refreshUserObj }) => {
  console.log("userObj:", userObj);
  const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);
  const history = useHistory();
  const auth = getAuth();
  const onLogout = () =>
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("로그아웃 성공");
      })
      .catch((error) => {
        // An error happened.
        console.log("error:", error);
      });
  //   const getMyNweets = async () => {
  //     const q = query(
  //       collection(dbService, "nweets"),
  //       where("creatorId", "==", userObj.uid),
  //       orderBy("createdAt", "desc")
  //     );

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   };
  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
        });
        setNewDisplayName("");
        refreshUserObj();
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  //   useEffect(() => {
  //     getMyNweets();
  //   }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={newDisplayName}
          type="text"
          placeholder="Display Name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogout}>Log out</button>
    </>
  );
};

export default Profile;

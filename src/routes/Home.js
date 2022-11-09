import { dbService, storageService } from "fbase";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweetList, setNweetList] = useState([]);
  const imgRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
  const [attachment, setAttachment] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrl = "";
      if (attachment) {
        const response = await uploadString(imgRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
      }

      await addDoc(collection(dbService, "nweets"), {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      });
      alert("Post 성공");
      setNweet("");
      setAttachment("");
    } catch (error) {
      alert(error);
      console.log("error in addDoc:", error);
    }
  };
  const onChange = (e) => {
    const { value } = e.target;
    setNweet(value);
  };
  //   const getNweetList = async () => {
  //     const querySnapshot = await getDocs(collection(dbService, "nweets"));

  //     querySnapshot.forEach((doc) => {
  //       const nweetObj = {
  //         id: doc.id,
  //         ...doc.data(),
  //       };
  //       setNweetList((prev) => [nweetObj, ...prev]);
  //     });
  //   };

  const onFileChange = (e) => {
    const theFile = e.target.files[0]; // file 객체
    const reader = new FileReader();
    reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
    reader.onloadend = (finishedEvent) => {
      console.log("finishedEvent:", finishedEvent); // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
      setAttachment(finishedEvent.currentTarget.result);
    };
  };

  const onClear = () => setAttachment(null);

  useEffect(() => {
    // getNweetList();
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweetList(nweetList);
    });
  }, []);

  return (
    <div>
      <form>
        <input
          onChange={onChange}
          value={nweet}
          type="text"
          placeholder="Waht's on your mind?"
          maxLength={120}
        />
        <input onChange={onFileChange} type="file" accept="image/*" />
        <input onClick={onSubmit} type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClear}>Clear</button>
          </div>
        )}
      </form>
      <section>
        {nweetList?.map((nweet) => {
          return (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
          );
        })}
      </section>
    </div>
  );
};
export default Home;

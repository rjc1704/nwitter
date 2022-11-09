import React, { useState } from "react";
import { deleteDoc, collection, doc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "firebase/storage";

export default function Nweet({
  isOwner,
  nweetObj: { createdAt, text, id, attachmentUrl },
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(text);
  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "nweets", id));
      const resp_delete = await deleteObject(
        ref(storageService, attachmentUrl)
      );
    }
  };
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const onChange = (e) => {
    setNewNweet(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const nweetRef = doc(dbService, "nweets", id);
    await updateDoc(nweetRef, { text: newNweet });
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="What is your Nweet?"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <div style={{ border: "1px solid black", marginTop: "10px" }}>
          <p>{text}</p>
          <p>{Date(createdAt).slice(0, 15)}</p>
          <img src={attachmentUrl} width="50px" height="50px" />
          {isOwner && (
            <div>
              <button onClick={onDelete}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

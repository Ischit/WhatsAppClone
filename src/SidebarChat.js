import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import db from "./firebase";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      const roomRef = doc(db, "rooms", id);
      const messagesCollection = collection(roomRef, "messages");

      onSnapshot(messagesCollection, (snapshot) => {
        const sortedMessages = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => b.timestamp - a.timestamp);
        setMessages(sortedMessages);
      });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter name for chat room");

    if (roomName) {
      const roomsCollection = collection(db, "rooms");
      await addDoc(roomsCollection, {
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`}
        />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;

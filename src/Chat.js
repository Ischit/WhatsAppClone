import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useStateValue } from "./StateProvider";
import { serverTimestamp } from "firebase/firestore";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      onSnapshot(roomDocRef, (snapshot) => {
        setRoomName(snapshot.data().name);
      });

      const roomRef = doc(db, "rooms", roomId);
      const messagesCollection = collection(roomRef, "messages");

      onSnapshot(messagesCollection, (snapshot) => {
        const sortedMessages = snapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const messagesCollection = collection(db, "rooms", roomId, "messages");

    await addDoc(messagesCollection, {
      message: input,
      name: user?.displayName,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`}
        />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              user?.displayName === message?.name && "chat__reciever"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticon className="chatfooter__icon" />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a Message
          </button>
        </form>
        <Mic className="chatfooter__icon" />
      </div>
    </div>
  );
}

export default Chat;

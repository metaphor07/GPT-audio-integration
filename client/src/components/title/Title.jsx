import React, { useState } from "react";
import "./title.css";
import CachedIcon from "@mui/icons-material/Cached";

const Title = ({ setMessages }) => {
  const [isReseting, setIsReseting] = useState(false);

  const resetConversation = async () => {
    setIsReseting(true);
    try {
      setMessages([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong, Plz try again");
    }
    setIsReseting(false);
  };
  return (
    <div className="title">
      <div className="heading">GPT-Audio</div>
      <button onClick={resetConversation} className="resetButton">
        <CachedIcon className="resetIcon" />
      </button>
    </div>
  );
};

export default Title;

import React, { useEffect, useState } from "react";
import "./controller.css";
import axios from "axios";
import Title from "../title/Title";
import RecordMessage from "../recordMessage/RecordMessage";
import { useSpeechSynthesis } from "react-speech-kit";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { SERVER_URL } from "../../helper";

const Controller = () => {
  // for speak
  const { speak } = useSpeechSynthesis();

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleStop = async (transcript) => {
    setIsLoading(true);
    axios
      .post(SERVER_URL, {
        text: transcript,
      })
      .then((res) => {
        const myMassage = { sender: "me", transcript };
        const data = res.data;
        const botMassage = { sender: "bot", data };
        const messageArr = [...messages, myMassage, botMassage];
        setMessages(messageArr);

        // setAudioData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, Plz try again");
        setIsLoading(false);
      });
  };

  return (
    <div className="controller">
      <Title setMessages={setMessages} />
      {messages?.length < 1 && (
        <h1 className="content">
          No Conversation Yet! Press & Hold the Mic to start conversation
        </h1>
      )}
      {messages?.map((data, i) => (
        <div className="chat-container" key={i}>
          <div className="chat">
            <div
              className={
                data?.sender === "me" ? "message right" : "message left"
              }
            >
              {data?.sender === "me" ? (
                <div className="item">
                  <p style={{ fontSize: "20px" }}>ME :</p>
                  <button
                    onClick={() => speak({ text: data.transcript })}
                    className="itemBtn"
                  >
                    <PlayCircleOutlineIcon className="btnIcon" />
                  </button>
                </div>
              ) : (
                <div className="item">
                  <p style={{ fontSize: "20px" }}>BOT :</p>
                  <audio src={data.data} controls className="audioFile" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="recorder">
        <div className="recorder-item">
          <RecordMessage handleStop={handleStop} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Controller;

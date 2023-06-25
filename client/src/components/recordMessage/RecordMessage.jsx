import React, { useEffect, useState } from "react";
import "./recordMessage.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicOffIcon from "@mui/icons-material/MicOff";

const RecordMessage = ({ handleStop, isLoading }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListening = () => {
    setIsListening(true);
    // SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    SpeechRecognition.startListening();
  };
  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();

    if (transcript.length > 0) {
      handleStop(transcript);
    } else {
      alert("no audio detected!");
    }
    resetTranscript();
  };
  useEffect(() => {}, [transcript]);
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div style={{ marginTop: "2px", cursor: "pointer" }}>
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        className={
          isLoading ? "offBtn" : isListening ? "recordingBtn" : "recordButton"
        }
        disabled={isLoading}
      >
        {isLoading ? (
          <MicOffIcon className="micOff" />
        ) : (
          <MicNoneIcon className={isListening ? "micRecIcon" : "micIcon"} />
        )}
      </button>
      <p
        style={{
          marginTop: "5px",
          color: "white",
          fontWeight: "lighter",
          fontSize: "20px",
        }}
      >
        {isLoading
          ? "Generating Response..."
          : isListening
          ? "recording"
          : "stopped"}
      </p>
    </div>
  );
};

export default RecordMessage;

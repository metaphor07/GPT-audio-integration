const express = require("express"); //Import the express framework
const app = express(); //create a instanse of the framwork
const fs = require("fs"); //Import file system module
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai"); // Import OpenAI SDK
const gTTS = require("gtts"); // Import the gTTS (Google Text-to-Speech) library
const upload = require("./firebase"); // Import the custom Firebase upload module

// cors middleware is used to call the server side code form different port number
app.use(cors());

// this middleware is used to parse incoming request bodies with JSON payloads, allowing easy access to the JSON data sent in the request.
app.use(express.json());

const port = process.env.PORT || 5000;

// It is a text to voice convert and store to the firebase
const textToVoice = (text) => {
  return new Promise((resolve, reject) => {
    var gtts = new gTTS(text, "en"); // Create a gTTS instance for English language
    gtts.save("hello.mp3", function (err, result) {
      if (err) {
        reject(err);
      }
      const filePath = "hello.mp3";

      // Read the generated audio file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // after read the file data upload it to the firebase storage for use in client side
      fileBuffer &&
        upload(fileBuffer, "mp3", "siri")
          .then((url) => {
            resolve(url);
          })
          .catch((err) => {
            reject(err);
          });
    });
  });
};

// create the configuration for openai
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use the OpenAI API key from environment variables
});
const openai = new OpenAIApi(configuration); // Create an instance of the OpenAI API

app.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003", // Specify the model for text completion
      prompt: `${text}`, //set the prompt by passing the user requested text/message
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    const responseData = response.data.choices[0].text; //Here, store the receive data/result from the openAi

    // Now convert the text data into a audio file using textToVoice function which implement above
    textToVoice(responseData)
      .then((url) => {
        res.status(200).json(url); //the function basically return the url of the firebase storage url after successfully completion
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).json("Uncaught error occured!");
  }
});

// Listining the server at port number 5000 bydefault
app.listen(port, () => {
  console.log(`Listining on port no: ${port}`);
});

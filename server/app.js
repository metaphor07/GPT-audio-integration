const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const gTTS = require("gtts");
const upload = require("./firebase");

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// const text to voice convert and store to the firebase
const textToVoice = (text) => {
  return new Promise((resolve, reject) => {
    var gtts = new gTTS(text, "en");
    gtts.save("hello.mp3", function (err, result) {
      if (err) {
        reject(err);
      }
      const filePath = "hello.mp3";

      // Read the generated audio file as a buffer
      const fileBuffer = fs.readFileSync(filePath);
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
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${text}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    const responseData = response.data.choices[0].text;
    textToVoice(responseData)
      .then((url) => {
        res.status(200).json(url);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).json("Uncaught error occured!");
  }
});

app.listen(port, () => {
  console.log(`Listining on port no: ${port}`);
});

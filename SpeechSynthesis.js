const { readFileSync } = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const audioFile = "Audio.mp3";

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION
);
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

speechConfig.speechSynthesisOutputFormat =
  sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

function xmlToString(filePath) {
  const xml = readFileSync(filePath, "utf-8");
  return xml;
}

let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

const ssml = xmlToString("Speech.ssml");

synthesizer.speakSsmlAsync(
  ssml,
  (result) => {
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      console.log("\nSíntese finalizada");
    } else {
      console.error(
        "Síntese de fala cancelada, " +
          result.errorDetails +
          "\nVocê definiu a chave e a região corretamente?"
      );
    }

    synthesizer.close();
    synthesizer = null;
  },
  (error) => {
    console.trace("Error - " + error);
    synthesizer.close();
    synthesizer = null;
  }
);
console.log("Sintetizando para: " + audioFile);

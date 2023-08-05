const ffmpeg = require("fluent-ffmpeg");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
require('dotenv').config({ path: '.env.dev' });

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION,
);
speechConfig.speechRecognitionLanguage = "en-US";

const CORS_HEADERS = {  
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};


exports.handler = async (event) => {
  console.log('event: ',event)
  
  switch (event.requestContext.http.method) {
    case 'POST':
      if (event.requestContext.http.path === "/upload") {
        return await uploadHandler(event);
      } else if (event.requestContext.http.path === "/process") {
        return await processHandler(event);
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ success: false, message: 'Route not found' })
        };
      }
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, message: 'Method not allowed' })
      };
  }
};

async function uploadHandler(event) {
  const fileName = event.queryStringParameters && event.queryStringParameters.filename;

  if (!fileName) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, message: 'Filename is required as a query parameter.' })
    };
  }

  const params = {
    Bucket: 'videos-analysis',
    Key: fileName,
    Expires: 3600,
    ContentType: 'video/webm'
  };

  try {
    const signedUrl = S3.getSignedUrl('putObject', params);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, signedUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, message: 'Failed to generate signed URL', error })
    };
  }
}

async function processHandler(event) {
  const filename = event.pathParameters.filename;

  if (!filename) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, message: 'Filename is required.' })
    };
  }

  // Add your processing logic here

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ success: true, message: 'Processing started.' })
  };
}


// function extractAudio(buffer) {
//   return new Promise((resolve, reject) => {
//     ffmpeg()
//       .toFormat("wav")
//       .input(buffer)
//       .on("end", resolve)
//       .on("error", reject)
//       .pipe();
//   });
// }

// async function callAzureSpeechToText(buffer) {
//   // First, we obtain a token using our subscription key.
//   const token = await getAzureToken();

//   // Construct the Speech-to-Text API URL. Replace `YOUR_REGION` with the appropriate region.
//   const speechToTextURL = `https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

//   const response = await axios.post(speechToTextURL, buffer, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
//       Accept: "application/json",
//     },
//   });

//   if (response.data && response.data.RecognitionStatus === "Success") {
//     return response.data.DisplayText;
//   } else {
//     throw new Error("Azure Speech to Text API failed");
//   }
// }

// async function getAzureToken() {
//   const response = await axios.post(AZURE_ENDPOINT, null, {
//     headers: {
//       "Ocp-Apim-Subscription-Key": AZURE_SUBSCRIPTION_KEY,
//       "Content-Length": 0,
//     },
//   });

//   return response.data;
// }

// // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"

// function fromFile() {
//     let audioConfig = sdk.AudioConfig. .fromWavFileInput(fs.readFileSync("YourAudioFile.wav"));
//     let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

//     speechRecognizer.recognizeOnceAsync(result => {
//         switch (result.reason) {
//             case sdk.ResultReason.RecognizedSpeech:
//                 console.log(`RECOGNIZED: Text=${result.text}`);
//                 break;
//             case sdk.ResultReason.NoMatch:
//                 console.log("NOMATCH: Speech could not be recognized.");
//                 break;
//             case sdk.ResultReason.Canceled:
//                 const cancellation = sdk.CancellationDetails.fromResult(result);
//                 console.log(`CANCELED: Reason=${cancellation.reason}`);

//                 if (cancellation.reason == sdk.CancellationReason.Error) {
//                     console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
//                     console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
//                     console.log("CANCELED: Did you set the speech resource key and region values?");
//                 }
//                 break;
//         }
//         speechRecognizer.close();
//     });
// }

const ffmpeg = require("fluent-ffmpeg");
const Azure = require("microsoft-cognitiveservices-speech-sdk");
const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const { readFileSync, writeFileSync } = require("fs");

// require('dotenv').config()

//ffmpeg.setFfmpegPath("/opt/bin/ffmpeg");
//ffmpeg.setFfprobePath("/opt/bin/ffprobe");

ffmpeg.setFfmpegPath("ffmpeg-layer/bin/ffmpeg");
ffmpeg.setFfprobePath("ffmpeg-layer/bin/ffprobe");


const speechConfig = Azure.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION,
);
speechConfig.speechRecognitionLanguage = "en-US";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};

const runCatching = async (func, err) => {
  try {
    return { success: true, result: await func() };
  } catch {
    return { success: false };
  }
};

exports.handler = async (event) => {
  if (event.requestContext.http.path === "/upload") {
    return await uploadHandler(event);
  } else if (event.requestContext.http.path === "/process") {
    return await processHandler(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ success: false, message: "Route not found" }),
      Headers: CORS_HEADERS,
    };
  }
};

async function uploadHandler(event) {
  const fileName =
    event.queryStringParameters && event.queryStringParameters.filename;

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Filename is required as a query parameter.",
      }),
      Headers: CORS_HEADERS,
    };
  }

  const params = {
    Bucket: "videos-analysis",
    Key: fileName,
    Expires: 3600,
    ContentType: "video/webm",
  };

  try {
    const signedUrl = S3.getSignedUrl("putObject", params);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, signedUrl }),
      Headers: CORS_HEADERS,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to generate signed URL",
        error,
      }),
      Headers: CORS_HEADERS,
    };
  }
}

async function processHandler(event) {
  const filename =
    event.queryStringParameters && event.queryStringParameters.filename;

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Filename is required.",
      }),
      Headers: CORS_HEADERS,
    };
  }

  const s3Result = await runCatching(
    async () =>
      await S3.getObject({
        Bucket: "videos-analysis",
        Key: filename,
      }).promise(),
  );

  if (!s3Result.success) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        success: false,
        message: "Could not find file with name " + filename,
        error,
      }),
      Headers: CORS_HEADERS,
    };
  }

  const video = s3Result.result;

  writeFileSync("/tmp/input.mp4", video.Body);

  await extractAudioFromVideo();

  const audio = readFileSync("/tmp/output.wav");

  // Code below will put audio file into S3

  const params = {
    Bucket: "videos-analysis",
    Key: `${filename}_audio.wav`,
    Body: audio,
    ContentType: "audio/wav",
  };

  await S3.putObject(params).promise();

  const audioConfig = Azure.AudioConfig.fromWavFileInput(audio);

  speechConfig.requestWordLevelTimestamps();
  speechConfig.outputFormat = Azure.OutputFormat.Detailed;

  const recognizer = new Azure.SpeechRecognizer(speechConfig, audioConfig);

  const result = await new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === Azure.ResultReason.RecognizedSpeech) {
          resolve(result);
        } else {
          reject(new Error(`Recognition failed: ${JSON.stringify(result)}`));
        }
      },
      (error) => {
        console.error("Error:", error);
        recognizer.close();
        reject(error);
      },
    );
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: result }),
    Headers: CORS_HEADERS,
  };
}

async function extractAudioFromVideo() {
  await new Promise((resolve, reject) => {
    ffmpeg("/tmp/input.mp4")
      .audioBitrate(64)
      .inputFormat("mp4")
      .toFormat("wav")
      .output("/tmp/output.wav")
      .on("end", function () {
        console.log("conversion ended");
        resolve(null);
      })
      .on("error", function (err) {
        console.log("error: ", err.code, err.msg);
        reject(err);
      })
      .run();
  });
}
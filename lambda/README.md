# SpeakSense - Backend

This project is part of a web app that allows users to upload video files, extract audio from the video, and generate transcripts using Azure Cognitive Services' Speech to Text API. This README focuses on the backend implementation, which includes AWS Lambda functions for handling file uploads and audio processing.

## Table of Contents

- [Project Overview](#project-overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Project Overview

The backend of the application is responsible for handling video uploads, extracting audio, and generating transcripts using the Azure Cognitive Services' Speech to Text API. It utilizes AWS Lambda functions and AWS SDK for interactions with Amazon S3.

The core functionalities of the backend include:
- Accepting video file uploads and generating signed URLs for S3.
- Extracting audio from video files using `fluent-ffmpeg`.
- Using the Azure Speech SDK to transcribe audio into text.
- Storing audio and transcript data back into Amazon S3.

For documentation on [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

## Setup

1. Install the required dependencies by running:

    `npm install`

2. Configure your AWS credentials:
- Ensure that you have AWS CLI installed and configured with necessary permissions.
- You can configure your AWS credentials using `aws configure`.

3. Configure your Azure credentials:
- For Azure Cognitive Services - Speech to Text API - Set up API credentials and endpoints for the Speech to Text service.

4. Create a `.env` file in the project root and add the following environment variables:
    `SPEECH_KEY=your_azure_speech_key`
    `SPEECH_REGION=your_azure_speech_region`


## Building locally and testing

1. Create a lambda instance using your AWS console and keep a note of the API url, you will be needing it for the frontend 

2. If you haven't already, setup AWS SAM CLI on you machine

3. Uncomment the code from line 7 to 10 on index.js and you will also need to install dotenv

4. Make sure that the backend is building locally using : `sam local invoke MyLambdaFunction --event event.json`

5. Build the zip file using: `npm run build` which creates a zip file in the build

6. Upload this file to your lambda using the AWS console.

5. Create an bucket in S3 bucket: [AWS S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html

## Deployment

To deploy the backend functions to AWS Lambda, follow these steps just upload the newly created `build/lambda.zip` to the Lambda using AWS console


## Contact

For any questions or support, please contact [Shoaib Sheikh] at [sheiksho28@gmail.com] or [https://github.com/ssheikh08].





# SpeakerSense Application

Welcome to the SpeakerSense application repository! This application allows users to upload video files, extract audio, and generate transcripts using Azure Cognitive Services' Speech to Text API. The purpose of this application is to create automatic transcripts and speaker analytics from videos uploaded by end-users. The goal is to provide important engagement analytics from educational videos.

## Table of Contents

- [Overview](#overview)
- [Frontend](#frontend)
- [Backend](#backend)
- [Getting Started](#getting-started)
- [Future Plans](#future-plans)
- [Contact](#contact)

## Overview

The SpeakerSense application is divided into two main components: the frontend(speaker-sense) and the backend(lambda). The frontend is responsible for user interactions, including video uploads and presenting transcripts. The backend handles video processing, audio extraction, and transcript generation using AWS Lambda and Azure Cognitive Services.

For detailed instructions on setting up and using each component, refer to their respective README files:

- [Frontend README](./speaker-sense/README.md)
- [Backend README](./lambda/README.md)

## Frontend

The frontend of the application is built using Angular. It provides a user-friendly interface for uploading video files and displaying generated transcripts. For more information on how to set up and use the frontend, please refer to the [Frontend README](./speaker-sense/README.md).

## Backend

The backend of the application handles the processing of video uploads, audio extraction, and transcript generation. It utilizes AWS Lambda functions and Azure Cognitive Services for these tasks. To learn more about setting up and deploying the backend, please check out the [Backend README](./lambda/README.md).

## Getting Started

To get started with the SpeakerSense application, follow these steps:

1. Set up and configure the backend as described in the [Backend README](./lambda/README.md).
2. Set up and configure the frontend as explained in the [Frontend README](./speaker-sense/README.md).
3. Run the application and start uploading video files to generate transcripts.

## Future Plans

In future iterations of the SpeakerSense application, we plan to enhance its capabilities by integrating Azure's Text Analytics API and AI Video Indexer. This will enable us to provide advanced speaker analytics and engagement insights from the uploaded videos.

Stay tuned for updates on these exciting features!

## Contact

For any questions or support, please contact [Shoaib Sheikh] at [sheiksho28@gmail.com] or [https://github.com/ssheikh08].

Thank you for using SpeakerSense to simplify audio transcription and analysis!

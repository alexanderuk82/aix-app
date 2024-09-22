
# AIX Project

AIX is a project using OpenAI and ChatGPT (version 4.0) to conduct generalized interviews that are analyzed by AI. The mission is to identify software issues and problems.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Visualization](#visualization)
5. [Technologies Used](#technologies-used)
6. [Repository](#repository)
7. [License](#license)

## Features

AIX offers the following key functionalities:

- **Responses**: The program provides two types of interview responses:
  - Normal UX Insight
  - Atomic Insights

- **Storage**: You can store companies, interviews, and users.

- **Frontend and Backend Connection**: The project is built with both a frontend and backend.
  - **Backend**: Powered by Strapi (Headless CMS) with MySQL.
  - **Frontend**: Built with Next.js, Tailwind, React, and Shadcn UI.

- **Animations**: It uses Lotties Animation, fully composed through components and passed via props.

- **Authentication**: Uses Kinde for user authentication.

- **Audio and Text Uploads**: You can upload interviews via text or audio:
  - **Audio Processing**: Audio is transcribed by Assembly AI into text, and then the text is passed to OpenAI (ChatGPT) to generate a new response based on the user's audio submission.
 
  ## Visualization

Here are some visual examples of how the AIX platform works:

- **Introduction**:

  <img src="./intro.gif" alt="Intro" width="500" height="auto" />

- **File Upload Process**:
 

- **Results Display**:


- **Chat Functionality**:


## Installation

To set up the project, follow these steps to connect both the frontend and backend:

1. Clone the repository:
   ```bash
   git clone https://github.com/alexanderuk82/aix-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd aix-app
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Install backend dependencies:
   Follow the instructions in the backend directory to set up Strapi with MySQL.

5. To start the project:
   - Start the backend server:
     ```bash
     npm run start:backend
     ```
   - Start the frontend server:
     ```bash
     npm run start:frontend
     ```

## Usage

Once the project is running, you can start conducting interviews by either uploading text or audio files. The AI will process these inputs and provide the relevant UX or Atomic Insights.

- **Audio Upload**: Audio files are transcribed using Assembly AI, and the transcribed text is processed by OpenAI to generate interview responses.
- **Text Upload**: Submit text-based interviews directly, and OpenAI will generate responses based on the provided text.


## Technologies Used

- **Backend**: Strapi (Headless CMS) with MySQL
- **Frontend**: Next.js, Tailwind, React, and Shadcn UI.
- **Authentication**: Kinde
- **AI Technologies**: OpenAI for text processing, Assembly AI for audio transcription

## Repository

The full project can be accessed at the following link: [GitHub Repository](https://github.com/alexanderuk82/aix-app).

## License

This project is licensed under the MIT License.


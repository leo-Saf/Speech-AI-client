# Speech-AI-client

# Speech-AI-client - React Web App

This project is a React web application that involves various functionalities, such as user authentication, audio uploading, conversation history, and admin panel. It integrates with the backend to process speech-to-text and displays historical data.

## To Run the Project
1. Install the dependencies by running npm install.
2. Start the application by running npm start.

## Requirements

Before you start, make sure you have the following installed:

- [React Router](https://reactrouter.com/) /npm install react-router-dom/  for routing within the app 
- [Axios](https://axios-http.com/) /npm install axios / for HTTP requests
- [react-toastify](https://fkhadra.github.io/react-toastify/) /npm install react-toastify / for notifications

## Install Dependencies

1. Clone this repository:

   ```bash
   git clone https://github.com/leo-Saf/Speech-AI-client.git
   



## The following dependencies will be installed:

* react-router-dom - For handling routing inside the React application.
* axios - For making HTTP requests.
* react-toastify - For displaying notifications to the user.
* react - The core library of the application.
* react-dom - For rendering components in the DOM.

## Available Scripts
npm start: Starts the app in development mode. Open http://localhost:3000 to view it in the browser.

## Project Structure
Here’s a breakdown of the key components:

* src/components/
* Home.js: The homepage where users can upload audio and view data.
* HistoryPage.js: Displays historical data for the logged-in user.
* AudioUploader.js: Lets users upload audio for speech-to-text conversion.
* AdminPage.js: Allows admins to view and manage user data.
* Register.js: Component for registering new users.
* Login.js: Component for logging users into the application.

## Key Features
1.  ### User Authentication:

Allows users to register, login, and log out with success/failure messages using react-toastify.
Admin users have access to additional functionalities, such as managing conversations.

2. ### Audio Uploading:

Users can upload audio for conversion via the AudioUploader component. This integrates with an API for processing the audio.

3. ### Admin Panel:

 * - View a list of all users.
 * - Select a user and view their conversations.
 * - Update user information (email, password, and admin status).
 * - Delete a user.
 * - View all conversations across users through the AllConversations component.


# Notes

1. ### Styling:

Custom styles are applied via CSS files like AdminPage.css, HistoryStyle.css, and styling.css.

2. ###  Toast Notifications:

Notifications for actions such as logging in or registering a user are managed by react-toastify.

3. ### Email Handling:

Email addresses are stored and handled via useState in App.js.

4. ### Transcription:

You need to choose a language for transcription in the drop down menu to be able to start a session.
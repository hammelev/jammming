## React-based Spotify Playlist Maker

This project was created to gain experience with React as part of the Codecademy course [Create a Front-End App with React](https://www.codecademy.com/learn/paths/build-web-apps-with-react).

Jammming allows users to search the Spotify library, create a custom playlist, and then save it to their Spotify account.

Additional features implemented for the project beyond the Codecademy course specification:
* Loading indicator to provide the user with a visual indicator while data is being fetched.
* Error messages
* Logout functionality
* Using PKCE instead of implicit grant for OAuth
* Environment files for configuration to be used by CI/CD pipeline

## Tech Stack
*   **Frontend:** React (Hooks, Functional Components), HTML5, CSS3 (CSS Modules)
*   **JavaScript:** ES6+
*   **API Integration:** Spotify Web API
*   **Development Tools:** VS Code with Gemini Code Assist, Git, npm
*   **Deployment:** Github Pages

## Key Learnings & Skills Demonstrated
*   **OAuth (PKCE Protocol):** Implemented secure user authentication with the Spotify API using the Proof Key for Code Exchange (PKCE) protocol.
*   **AI-Assisted Development:** Leveraged Gemini for code generation, refactoring suggestions, and test case creation, enhancing development efficiency and code quality.
*   **DevOps & CI/CD:** Established a continuous integration and deployment (CI/CD) pipeline using GitHub Actions, and integrated Gemini for automated pull request reviews to increase code quality and reduce bugs.
*   **API Consumption:** Asynchronously fetched data from and posted data to the Spotify API, including robust handling of loading states, error conditions, and data parsing for a smooth user experience.
*   **React Development:** Built a responsive single-page application (SPA) using modern React features like Hooks (e.g., `useState`, `useEffect`) for state management and lifecycle control within functional components, and CSS Modules for scoped styling.

## Demo version of the project

A demo version of the project can be found here: [Jammming by Hammelev](https://hammelev.github.io/jammming)

**Note:** A Spotify account is required to use the application's features.

## Running the application

To run the application locally:

1.  **Ensure Node.js is installed:** This includes npm (Node Package Manager).
2.  **Clone the repository:**
    ```bash
    git clone https://github.com/hammelev/jammming.git
    cd jammming
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Configure Spotify API Credentials:**
    **Note:** This step is only needed if the application needs to be run on a different domain than http://127.0.0.1:3000/jammming or https://hammelev.github.io/jammming.

    *   Go to the Spotify Developer Dashboard and log in or create an account.
    *   Click "Create App" (or a similar button).
    *   Give your application a name (e.g., "Jammming YourName") and a brief description.
    *   Set the **Redirect URI(s)**. For local development, add `http://127.0.0.1:3000/jammming/callback`. If you plan to deploy, add your production redirect URI as well. Click "Save".
    *   Once your app is created and saved, you will see your **Client ID**.
    *   Add your Spotify Client ID and the Redirect URI you configured to the appropriate environment file (`.env` and `.env.production`):
        ```plaintext
        REACT_APP_SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
        REACT_APP_SPOTIFY_REDIRECT_URI=YOUR_REDIRECT_URI_HERE
        ```
    *   Replace `YOUR_SPOTIFY_CLIENT_ID_HERE` with your actual Client ID.
    *   Ensure `REACT_APP_SPOTIFY_REDIRECT_URI` matches exactly what you entered in the Spotify Developer Dashboard for local development.
    *   The application uses these environment variables (prefixed with `REACT_APP_`) to interact with the Spotify API. The `.env.production` file in the repository is used for the deployed GitHub Pages version.

5.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your default web browser at `http://127.0.0.1:3000/jammming`.

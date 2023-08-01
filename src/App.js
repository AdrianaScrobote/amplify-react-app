import "./App.css";
import { Amplify } from "aws-amplify";
import { withAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsconfig from "./aws-exports";
import React from "react";
Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div className="App">
            <header className="App-header">
              <button onClick={signOut}>Sign out</button>
              <h2>My App Content</h2>
            </header>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default withAuthenticator(App);

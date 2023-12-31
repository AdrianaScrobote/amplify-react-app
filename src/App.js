import "./App.css";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator, Authenticator, Icon } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { listSongs } from "./graphql/queries";
import { updateSong } from "./graphql/mutations";

import { Paper, IconButton } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FavoriteIcon from "@material-ui/icons/Favorite";

import awsconfig from "./aws-exports";
import React, { useEffect, useState } from "react";
Amplify.configure(awsconfig);

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      console.log("songData", songData);
      const songList = songData.data.listSongs.items;
      console.log("songList", songList);
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };

  const addLike = async (idx) => {
    try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(
        graphqlOperation(updateSong, { input: song })
      );
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
    } catch (error) {
      console.log("error on adding Like to song", error);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div className="App">
            <header className="App-header">
              <button onClick={signOut}>Sign out</button>
              <h2>My App Content</h2>
            </header>
            <div className="songList">
              {songs.map((song, idx) => {
                return (
                  <Paper variant="outlined" elevation={2} key={`song${idx}`}>
                    <div className="songCard">
                      <IconButton aria-label="play">
                        <PlayArrowIcon />
                      </IconButton>
                      <div>
                        <div className="SongTitle">{song.title}</div>
                        <div className="SongOwner">{song.owner}</div>
                      </div>
                      <div>
                        <IconButton
                          aria-label="like"
                          onClick={() => addLike(idx)}
                        >
                          <FavoriteIcon />
                        </IconButton>
                        {song.like}
                      </div>
                      <div className="SongDescription">{song.description}</div>
                    </div>
                  </Paper>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default withAuthenticator(App);

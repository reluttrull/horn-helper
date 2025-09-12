import React, { useState } from "react";
import { LocalStorageKeys, Themes } from "../utils/GlobalKeys.js";

export const Help = () => {
const [theme] = useState(localStorage.getItem(LocalStorageKeys.THEME));

  return (
    <>
    <div id="help-block">
    <h2>Play tab</h2>
      <div>After pressing "Start", you will have one minute to get as many correct fingerings as possible.
        To enter a fingering, you can either use a touchscreen or a keyboard (using the letters in parentheses).  
        You will need to <em>hold down</em> the appropriate fingering for it to be counted.  
        In the image below, the user will need to hold down the 1 and 2 buttons for the 12 combination to be counted correct.  
        If your combination was correct, you will hear the note you just "played", and you will be shown the next card.
      </div>
      <img src={"/horn-helper/images/" + (theme == Themes.DARKMODE ? "dark" : "light") + "ShowCombination.png"} />
      <div>Once the game is over, you will be asked for your initials (up to three letters) to display with your score in your leaderboard.
      </div>
      <img src={"/horn-helper/images/" + (theme == Themes.DARKMODE ? "dark" : "light") + "SaveScore.png"} />
      <hr />
      <h2>Study tab</h2>
      <div>In your study tab (book icon), you can double-check your fingerings in between games.  
        Here you'll be able to study just the notes you're playing.  
        For example, if your settings are set to study only one octave with no accidentals, you will only see eight different notes here.
      </div>
      <img src={"/horn-helper/images/" + (theme == Themes.DARKMODE ? "dark" : "light") + "FingeringChart.png"} />
      <hr />
      <h2>Settings tab</h2>
      <div>In your settings tab (gear icon), you can change any of the options you selected when you first visited the page.</div>
      <img src={"/horn-helper/images/" + (theme == Themes.DARKMODE ? "dark" : "light") + "Settings.png"} />
      <hr />
      <h2>Leaderboard tab</h2>
      <div>In your leaderboard tab (chart icon), you can see all the scores from your device, from highest to lowest.  
        You can compete against your horn-playing friends, as long as it's on the same phone/tablet/computer.
      </div>
      <img src={"/horn-helper/images/" + (theme == Themes.DARKMODE ? "dark" : "light") + "Leaderboard.png"} />
    </div>
    </>
  );
};

export default Help;
import React, { useEffect, useState } from "react";

export const Leaderboard = () => {
  const [myScores, setMyScores] = useState([]);

  const scoresTable = myScores.map(score =>
    <li className="row" key={myScores.indexOf(score)}>
      <div className="column">{score.date}</div>
      <div className="column">{score.score}</div>
    </li>
  );

  useEffect(() => {
    var i, scoreArray = [];
    for (i in localStorage) {
      if (i.startsWith('score:')) {
        let split = i.substring(6).split(',');
        let thisScore = {"initials": split[0],"date": new Date(split[1]).toDateString(),"score": localStorage.getItem(i)};
        console.log(thisScore);
        scoreArray.push(thisScore);
      }
    }
    setMyScores(Array.from(scoreArray));
  }, []);
  

  return (
    <div>
      <h3>Local leaderboard</h3>
      <ul className="leaderboard">{scoresTable}</ul>
    </div>
  );
};

export default Leaderboard;
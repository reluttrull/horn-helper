import React, { useEffect, useState } from "react";

export const Leaderboard = () => {
  const [myScores, setMyScores] = useState([]);

  const scoresTable = myScores.map(score =>
    <div className="row" key={myScores.indexOf(score)}>
      <span className="column">{score.initials}</span>
      <span className="column leaderboard-cell">{score.date}</span>
      <span className="column">{score.score}</span>
    </div>
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
    scoreArray.sort((a,b) => b.score - a.score);
    console.log(scoreArray);
    setMyScores(Array.from(scoreArray));
  }, []);
  

  return (
    <div>
      <h3>Local leaderboard</h3>
      <div className="leaderboard console-style">{scoresTable}</div>
    </div>
  );
};

export default Leaderboard;
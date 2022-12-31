import React, { useEffect, useState } from 'react';

const SingleMatchup = ({currentMatchup, players}) => {
  const [playerA, setPlayerA] = useState();
  const [playerB, setPlayerB] = useState();

  useEffect(() => {
    const getPlayerById = (playerId) => {
      if (!players || !playerId) {
        console.error('SingleMatchup: getPlayerById: players or playerId is null or undefined');
        return null;
      }

      return players.find((player) => player.id === playerId);
    }
    
    const getPlayerA = () => {
      if (!currentMatchup || !currentMatchup.playerA) {
        console.error('SingleMatchup: getPlayerA: currentMatchup or player A is null or undefined');
        return null;
      }

      return getPlayerById(currentMatchup.playerA);
    }

    const getPlayerB = () => {
      if (!currentMatchup) {
        console.error('SingleMatchup: getPlayerB: currentMatchup is null or undefined');
        return null;
      }
      if (!currentMatchup.playerB) {
        return {
          id: -1,
          name: "Pause"
        }
      }

      return getPlayerById(currentMatchup.playerB);
    }

    setPlayerA(getPlayerA());
    setPlayerB(getPlayerB());
	}, [currentMatchup, players]);

  return (
    playerB?.id === -1 ? 
      <div>{ playerA?.name } has a pause</div> :
      <div>{ playerA?.name } vs { playerB?.name }</div> 
  );
};

export default SingleMatchup;
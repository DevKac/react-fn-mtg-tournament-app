import React, { useEffect, useState } from 'react';

import { IN_PROGRESS } from '../../consts/roundState';
import SingleMatchup from '../../components/SingleMatchup/SingleMatchup';

const TournamentPairings = ({pairings, rounds, players}) => {
  const [currentRound, setCurrentRound] = useState();
  const [currentPairings, setCurrentPairings] = useState();

  useEffect(() => {
    const getCurrentRound = () => {
      if (!rounds) {
        console.error('TournamentPairings: getCurrentRound:  rounds are null or undefined');
        return null;
      }
  
      return rounds.find((round) => (round?.status === IN_PROGRESS));
    }
  
    const getCurrentPairings = () => {
      if (!pairings) {
        console.error('TournamentPairings: getCurrentRound:  pairings are null or undefined');
        return null;
      }
  
      const currentRound = getCurrentRound();
      if (!currentRound) {
        return null;
      }
  
      return pairings.find((pairing) => pairing?.roundId === currentRound.id);
    }
    
    setCurrentRound(getCurrentRound());
    setCurrentPairings(getCurrentPairings());
	}, [pairings, rounds]);

  return (
    currentPairings ?
      <ul className='list-group'>
        <li className='list-group-item'><b>Pary na rundę { currentRound?.id }</b></li>
        { currentPairings.matchups.map((matchup) => <li key={matchup.id} className='list-group-item list-group-item-dark'><SingleMatchup currentMatchup={matchup} players={players} /></li>) }
    </ul> : '' 
  );
};

export default TournamentPairings;
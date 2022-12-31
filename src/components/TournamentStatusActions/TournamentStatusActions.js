import React from 'react';
import { useDispatch } from 'react-redux';

import { startTournament, startNewRound, endTournament } from '../../slices/currentTournament';
import { IN_PROGRESS, NOT_STARTED, FINISHED } from '../../consts/roundState';

const TournamentStatusActions = ({currentTournament}) => {
  const dispatch = useDispatch();

  const startTournamentClick = (event) => {
    event.preventDefault();
    dispatch(startTournament());
  }

  const startNewRoundClick = (event) => {
    event.preventDefault();
    dispatch(startNewRound());
  };

  const endTournamentClick = (event) => {
    event.preventDefault();
    dispatch(endTournament());
  };

  const renderTournamentActions = () => {
    if (!currentTournament || !currentTournament.rounds) {
      console.error('TournamentStatusActions: renderTournamentActions: currentTournament or rounds are null or undefined');
      return null;
    }
    
    if (currentTournament.rounds.at(-1)?.status === FINISHED) {
      return <div>Turniej zakończony</div>;
    }

    if (currentTournament.rounds.at(0)?.status === NOT_STARTED) {
      return (
        <button type='button' className='btn btn-outline-dark' onClick={startTournamentClick}>
          Rozpocznij turniej
        </button>
      );
    }

    if (currentTournament.rounds.at(-1)?.status === IN_PROGRESS) {
      return (
        <button type='button' className='btn btn-outline-dark' onClick={endTournamentClick}>
          Zakończ turniej
        </button>
      );
    }

    return (
      <button type='button' className='btn btn-outline-dark' onClick={startNewRoundClick}>
        Rozpocznij kolejną rundę
      </button>
    );
  }

  return (
    renderTournamentActions()
  );
};

export default TournamentStatusActions;

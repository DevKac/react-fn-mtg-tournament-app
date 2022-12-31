import React from 'react';

import TournamentPlayerScore from '../TournamentPlayerScore/TournamentPlayerScore';
import { NOT_STARTED, IN_PROGRESS } from '../../consts/roundState';

const TournamentPlayerRow = ({rounds, player}) => {
  const getPlayerScore = (rounds, player) => {
    if (!rounds || !player) {
      console.error('TournamentPlayerRow: getPlayerScore: rounds or player is null or undefined');
      return null;
    }
  
    return rounds.reduce(
      (sum, round) => {
        const roundScore = player.scores[round.id];
        if (round.status === NOT_STARTED || roundScore === null || roundScore === undefined) {
          return sum;
        }
        return sum + player.scores[round.id]
      }, 0
    );
  }

  return (
      <tr key={player?.id}>
        <th scope='row'>{ player?.name }</th>
        { rounds?.map((round) => <td key={round?.id} className={round?.status === IN_PROGRESS ? 'table-active' : ''}>
            <TournamentPlayerScore playerId={player?.id} roundId={round?.id} playerScore={player?.scores[round?.id]} />
          </td>
        )}
        <td>{ getPlayerScore(rounds, player) }</td>
      </tr>
  );
};

export default TournamentPlayerRow;

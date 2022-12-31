import React from 'react';

import TournamentTableHeader from '../TournamentTableHeader/TournamentTableHeader';
import TournamentPlayerRow from '../TournamentPlayerRow/TournamentPlayerRow';
import AddPlayerRow from '../AddPlayerRow/AddPlayerRow';

const SingleTournamentTable = ({tournamentId, rounds, players}) => {
  return (
    <React.Fragment>
      <table className='table'>
        <TournamentTableHeader rounds={rounds} />
        <tbody>
          { players?.map((player) => 
            <TournamentPlayerRow key={player.id} rounds={rounds} player={player} />
          )}
        </tbody>
      </table>
      <AddPlayerRow tournamentId={tournamentId} />
    </React.Fragment>
  );
};

export default SingleTournamentTable;

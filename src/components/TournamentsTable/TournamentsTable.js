import React from 'react';
import { Link } from 'react-router-dom';

import { IDLE, PENDING, FAILED, SUCCEEDED } from '../../consts/requestState';
import { isNonEmptyArray } from '../../helpers/TablesHelper/TablesHelper';
import LoadingState from '../LoadingState/LoadingState';
import ErrorState from '../ErrorState/ErrorState';

const TournamentsTable = ({ loadingState, tournaments }) => {
  const renderCorrectState = (state, tournaments) => {
    switch(state) {
      case FAILED:
        return renderErrorState();
      case SUCCEEDED:
        return isNonEmptyArray(tournaments) ?
          renderTournaments(tournaments) : renderEmptyState();
      case IDLE:
      case PENDING:
      default:
        return renderLoadingState();
    }
  }

  const renderErrorState = () => <ErrorState />;
  
  const renderLoadingState = () => <LoadingState />;

  const renderTournaments = tournaments => {
    if (!isNonEmptyArray(tournaments)) {
      return null;
    }
    
    const sortedTournaments = [...tournaments].sort((tournamentA, tournamentB) => {
      if (!tournamentA || !tournamentB) {
        return 0;
      }
      return new Date(tournamentB.added) - new Date(tournamentA.added);
    });

    return (
      <div className="list-group">
        { sortedTournaments.map(tournament => {
          if (!tournament) {
            console.error('TournamentsTable: renderTournaments: tournament is null or undefined');
            return null;
          }

          const dateAdded = new Date(tournament.added);
          return <Link className="list-group-item list-group-item-action list-group-item-dark" key={tournament.id} to={'/tournament/' + tournament.id}>
            { tournament.name }. Zgłoszony dnia { dateAdded.toLocaleDateString() }
          </Link>;
        })}
      </div>
    );
  }

  const renderEmptyState = () => <p>W chwili obecnej nie mamy żadnych turniejów</p>;

  return (
    <React.Fragment>
      { renderCorrectState(loadingState, tournaments) }
    </React.Fragment>
  );
};

export default TournamentsTable;

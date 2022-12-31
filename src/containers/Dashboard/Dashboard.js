import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTournaments, addNewTournament } from '../../slices/tournaments';
import TournamentsTable from '../../components/TournamentsTable/TournamentsTable';
import TournamentPostForm from '../../components/TournamentPostForm/TournamentPostForm';

const Dashboard = () => {
  const dispatch = useDispatch();
  const tournamentsState = useSelector((state) => {
    return state.tournaments
  });

  useEffect(() => {
    if (!tournamentsState.data?.length || tournamentsState.refreshData) {
      dispatch(fetchTournaments());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  const dispatchNewTournament = (tournament) => {
    if (!tournament?.name) {
      console.error('Dashboard: dispatchNewTournament: tournament or tournament name is null or undefined');
      return;
    }

    dispatch(addNewTournament(tournament));
  }

  return (
    <React.Fragment>
      <div className='section mt-4'>
        <TournamentsTable loadingState={ tournamentsState.fetching } tournaments={ tournamentsState.data } />
      </div>
      <div className='section mt-4'>
        <TournamentPostForm addNewTournament={ dispatchNewTournament } postingState={ tournamentsState.posting } />
      </div>
    </React.Fragment>
  );
};

export default Dashboard;

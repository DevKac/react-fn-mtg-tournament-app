import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { fetchCurrentTournament, updateCurrentTournament } from '../../slices/currentTournament';
import { isPending } from '../../helpers/ApiStateHelper/ApiStateHelper';
import SingleTournamentTable from '../../components/SingleTournamentTable/SingleTournamentTable';
import TournamentStatusActions from '../../components/TournamentStatusActions/TournamentStatusActions';
import TournamentPairings from '../../components/TournamentPairings/TournamentPairings';
import LoadingState from '../../components/LoadingState/LoadingState';

const Tournament = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentTournamentState = useSelector((state) => {
    return state.currentTournament
  });
  const currentTournament = useSelector((state) => {
    const currentTournamentInStore = state?.currentTournament?.data;
    if (currentTournamentInStore?.id?.toString() === id.toString()) {
      return currentTournamentInStore;
    }
  
    return null;
  });

  useEffect(() => {
    if (!currentTournament || currentTournamentState.refreshData) {
      dispatch(fetchCurrentTournament(id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  const saveChanges = (event) => {
		event.preventDefault();
    if (isPending(currentTournamentState.posting)) {
      return;
    }

    dispatch(updateCurrentTournament(currentTournament));
	};

  return (
    <div className='section mt-4'>
      { !currentTournament || isPending(currentTournamentState?.fetching) ?
        <LoadingState /> : 
        <div className='card'>
          <div className='card-body'>
            <b>Tournament name: { currentTournament?.name }</b>

            <div className='mt-2'>
              <SingleTournamentTable tournamentId={currentTournament?.id} rounds={currentTournament?.rounds} players={currentTournament?.players} />
            </div>
            <div className='row mt-4'>
              <div className='col-sm-6'>
                { currentTournament?.rounds?.length >= 2 && currentTournament?.players?.length >= 2 ?
                <TournamentStatusActions currentTournament={currentTournament} /> :
                <div>Dodaj przynajmiej 2 graczy i 2 rundy aby rozpocząć turniej</div>
                }
              </div>
              <div className='col-sm-6 mt-2 mt-sm-0'>
                <button type='button' className='btn btn-outline-dark float-sm-end' disabled={isPending(currentTournamentState.posting)} onClick={saveChanges}>
                  Save
                </button>
              </div> 
            </div>
            
            <div className='mt-4'>
              <TournamentPairings pairings={currentTournament?.pairings} rounds={currentTournament?.rounds} players={currentTournament?.players} />
            </div>
          </div>
        </div>
      }
    </div>
    
  );
};

export default Tournament;

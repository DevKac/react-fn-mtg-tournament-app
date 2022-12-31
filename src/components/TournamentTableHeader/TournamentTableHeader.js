import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isPending } from '../../helpers/ApiStateHelper/ApiStateHelper';
import { addRoundToCurrentTournament } from '../../slices/currentTournament';
import { IN_PROGRESS } from '../../consts/roundState';

const TournamentTableHeader = ({rounds}) => {
  const dispatch = useDispatch();
  const savingState = useSelector((state) => {
    return state.currentTournament?.posting
  });

  const addNewRound = (event) => {
		event.preventDefault();
    if (isPending(savingState)) {
      return;
    }


    dispatch(addRoundToCurrentTournament());
	};

  return (
    <thead>
      <tr>
        <th scope='col'>
          <button type='button' className='btn btn-outline-dark' disabled={isPending(savingState)} onClick={addNewRound}>
            Dodaj rundę
          </button>
        </th>
        { rounds?.map((round) => <th scope='col' key={round.id} className={round.status === IN_PROGRESS ? 'table-active' : ''}>Runda { round.id }</th>) }
        <th scope='col'>Suma</th>
      </tr>
    </thead>
  );
};

export default TournamentTableHeader;

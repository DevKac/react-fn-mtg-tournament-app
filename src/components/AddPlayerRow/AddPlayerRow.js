import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isPending } from '../../helpers/ApiStateHelper/ApiStateHelper';
import { addPlayerToCurrentTournament } from '../../slices/currentTournament';
import FormInvalidFeedback from '../FormInvalidFeedback/FormInvalidFeedback';

const AddPlayerRow = () => {
  const dispatch = useDispatch();
  const initPlayerForm = {
		formValidated: false,
		name: '',
		nameValid: false,
		nameErrors: []
  };
	const [playerForm, setPlayerForm] = useState(initPlayerForm);
  const players = useSelector((state) => {
    return state.currentTournament?.data?.players
  });
  const savingState = useSelector((state) => {
    return state.currentTournament?.posting
  });

  const isPlayerFormValid = () => {
		return playerForm?.nameValid
	}

	const validateAndSetPlayerName = (playerName) => {
		const violations = [];
		if (!playerName) {
			violations.push('Imię gracza nie może być pusta');
		}
		if (playerName && playerName.length < 2) {
			violations.push('Imię gracza musi mieć przynajmniej 2 znaki');
		}
		if (playerName && playerName.length > 20) {
			violations.push('Imię gracza może mieć maksymalnie 20 znaków');
		}
    if (playerName && players && players.find((player) => player?.name === playerName)) {
			violations.push('Imiona graczy nie mogą się powtarzać');
		}

		setPlayerForm({
			...playerForm,
			formValidated: true,
			name: playerName,
			nameValid: violations.length === 0,
			nameErrors: violations 
		});
	}

	const onNameInputChange = (event) => {
		if (!event || !event.target) {
			console.error('AddPlayerRow: onNameInputChange: event or target is null or undefined');
			return;
		}

		event.preventDefault();
		validateAndSetPlayerName(event.target.value);
	};
	
	const onSubmit = (event) => {
		event.preventDefault();
    if (isPending(savingState)) {
      return;
    }

		if (isPlayerFormValid()) {
      dispatch(addPlayerToCurrentTournament(playerForm.name));
			setPlayerForm(initPlayerForm);
		}
	};

  return (
    <form className='row mt-2' onSubmit={onSubmit}>
      <div className='col-sm-6 col-md-3'>
        <input
          type='text'
          className={!playerForm?.formValidated || playerForm?.nameValid ? 'form-control' : 'form-control is-invalid'}
          placeholder='Player&lsquo;s name'
          value={playerForm?.name}
          onChange={onNameInputChange}
        ></input>
        <FormInvalidFeedback formValidated={playerForm?.formValidated} errorsList={playerForm?.nameErrors} />
      </div>
    </form>
  );
};

export default AddPlayerRow;
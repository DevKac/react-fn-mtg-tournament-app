import React, { useState } from 'react';

import { isPending } from '../../helpers/ApiStateHelper/ApiStateHelper';
import FormInvalidFeedback from '../FormInvalidFeedback/FormInvalidFeedback';

const TournamentPostForm = ({addNewTournament, postingState}) => {
  const initTournamentForm = {
		formValidated: false,
		name: '',
		nameValid: false,
		nameErrors: []
  };
	const [tournamentForm, setTournamentForm] = useState(initTournamentForm)

	const isTournamentFormValid = () => {
		return tournamentForm?.nameValid
	}

	const validateAndSetTournamentName = (tournamentName) => {
		const violations = [];
		if (!tournamentName) {
			violations.push('Nazwa turnieju nie może być pusta');
		}
		if (tournamentName && tournamentName.length < 3) {
			violations.push('Nazwa turnieju musi mieć przynajmniej 3 znaki');
		}
		if (tournamentName && tournamentName.length > 30) {
			violations.push('Nazwa turnieju może mieć maksymalnie 30 znaków');
		}

		setTournamentForm({
			...tournamentForm,
			formValidated: true,
			name: tournamentName,
			nameValid: violations.length === 0,
			nameErrors: violations 
		});
	}

	const onNameInputChange = (event) => {
		if (!event || !event.target) {
			console.error('TournamentPostForm: onNameInputChange: event or target is null or undefined');
			return;
		}

		event.preventDefault();
		validateAndSetTournamentName(event.target.value);
	};
	
	const onSubmit = (event) => {
		event.preventDefault();
    if (isPending(postingState)) {
      return;
    }

		if (isTournamentFormValid()) {
			const tournament = {
				name: tournamentForm.name
			}
			addNewTournament(tournament);
      setTournamentForm(initTournamentForm);
		}
	};

	return (
		<div className='card'>
			<div className='card-body'>
				<b>Add new tournament</b>

				<form onSubmit={ onSubmit }>
					<div className='row mt-2'>
						<label htmlFor="tournamentNameInput" className='col-sm-2 col-form-label'>Name</label>
						<div className="col-sm-10">
							<input
								id='tournamentNameInput'
								type='text'
								className={!tournamentForm?.formValidated || tournamentForm?.nameValid ? 'form-control' : 'form-control is-invalid'}
								placeholder='Tournament name'
								value={ tournamentForm?.name }
								onChange={ onNameInputChange }
							></input>
							<FormInvalidFeedback formValidated={tournamentForm?.formValidated} errorsList={tournamentForm?.nameErrors} />
						</div>
					</div>
					
					<div className='float-end mt-2'>
						{ isPending(postingState) ?
							<div className='spinner-border' role='status'>
								<span className='visually-hidden'>Posting...</span>
							</div> :
							<button type='submit' className='btn btn-outline-dark' disabled={ !isTournamentFormValid() }>
								Submit
							</button>
						}
					</div>
				</form>
			</div>
		</div>
		
	);
};

export default TournamentPostForm;

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './TournamentPlayerScore.css';

import { setPlayerScoreInRound } from '../../slices/currentTournament';

const TournamentPlayerScore = ({playerId, roundId, playerScore}) => {
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const getPlayerScoreAsInputValue = (playerScore) => {
    return playerScore === null || playerScore === undefined ? '': playerScore;
  }

  const getInputValueAsPlayerScore = (inputValue) => {
    return inputValue === '' ? null: parseInt(inputValue);
  }

  const saveInputValueAsPlayerScore = () => {
    dispatch(setPlayerScoreInRound({ playerId, roundId, score: getInputValueAsPlayerScore(inputValue) }))
    setShowInput(false);
  }

  const resetInputValueToPlayerScore = () => {
    setShowInput(false);
    setInputValue(getPlayerScoreAsInputValue(playerScore));
  }

  useEffect(() => {
    setInputValue(getPlayerScoreAsInputValue(playerScore));
	}, [playerScore]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        saveInputValueAsPlayerScore();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, inputValue]);

  const onSubmit = (event) => {
		event.preventDefault();
    
    // jakaś walidacja?
    saveInputValueAsPlayerScore();
	};

  const onReset = (event) => {
		event.preventDefault();

    resetInputValueToPlayerScore();
	};

  const onInputChange = (event) => {
		event.preventDefault();

    setInputValue(event.target.value);
  }

  return (
    <React.Fragment>
      { showInput ?
        <div ref={wrapperRef}>
          <form onSubmit={onSubmit} onReset={onReset}>
            <div className='d-flex flex-row'>
              <input
                type='number'
                className='form-control short-form-control'
                autoFocus
                placeholder='Player&lsquo;s score'
                value={inputValue}
                onChange={onInputChange}
              ></input>
              <button type='submit' className='btn btn-outline-dark'>
                +
              </button>
              <button type='reset' className='btn btn-outline-dark'>
                X
              </button>
            </div>
          </form>
        </div> :
        <div onClick={() => setShowInput(true)}>
          { playerScore === undefined || playerScore === null ? 
            'No score' : playerScore
          }
        </div>
          
      }
    </React.Fragment>
  );
};

export default TournamentPlayerScore;

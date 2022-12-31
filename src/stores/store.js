import { configureStore  } from '@reduxjs/toolkit';

import tournamentsReducer from '../slices/tournaments';
import currentTournamentReducer from '../slices/currentTournament';

const store = configureStore({
	reducer: {
    tournaments: tournamentsReducer,
    currentTournament: currentTournamentReducer,
  },
});

export default store;

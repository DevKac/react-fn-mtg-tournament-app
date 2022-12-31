import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IDLE, PENDING, FAILED, SUCCEEDED } from '../consts/requestState';
import TournamentDataService from '../services/TournamentService/TournamentService';

const initialState = {
  data: [],
	refreshData: true,
	fetching: IDLE,
	fetchingError: null,
  posting: IDLE,
  postingError: null,
}

export const fetchTournaments = createAsyncThunk(
	'tournaments/fetchTournaments',
	async () => {
		const response = await TournamentDataService.getAll();
		if (response.ok) {
			const tournaments = await response.json();
			return { tournaments };
		}
	}
);

export const addNewTournament = createAsyncThunk(
	'tournaments/addNewTournament',
	async (payload) => {
		const response = await TournamentDataService.create(payload);

		if (response.ok) {
			const newTournament = await response.json();
			return { newTournament };
		}
	}
);

const tournamentsSlice = createSlice({
	name: 'tournaments',
	initialState,
	reducers: {},
	extraReducers: {
		// fetchTournaments
		[fetchTournaments.pending]: state => {
			state.fetching = PENDING;
			state.fetchingError = null;
    },
    [fetchTournaments.rejected]: (state, action) => {
      state.fetchingError = action.error.message;
			state.refreshData = true;
			state.fetching = FAILED;
    },
		[fetchTournaments.fulfilled]: (state, action) => {
			state.fetchingError = null;
			state.data = action.payload.tournaments;
			state.refreshData = false;
			state.fetching = SUCCEEDED;
		},
		// AddNewTournament
		[addNewTournament.pending]: state => {
      state.posting = PENDING;
      state.postingError = null;
    },
    [addNewTournament.rejected]: (state, action) => {
      state.postingError = action.error.message;
			state.refreshData = true;
			state.posting = FAILED;
    },
		[addNewTournament.fulfilled]: (state, action) => {
      state.postingError = null;
      state.data.push(action.payload.newTournament);
			state.refreshData = true;
			state.posting = SUCCEEDED;
		}
	},
});

export default tournamentsSlice.reducer;

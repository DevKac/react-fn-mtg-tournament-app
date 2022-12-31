import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IDLE, PENDING, FAILED, SUCCEEDED } from '../consts/requestState';
import { NOT_STARTED, IN_PROGRESS, FINISHED } from '../consts/roundState';
import TournamentDataService from '../services/TournamentService/TournamentService';
import { getRandomMatchups, getNewMatchups, allOpponentsPlayed, sortPlayersByTotalScore } from '../helpers/PairingsHelper/PairingsHelper';

const initialState = {
  data: [],
	refreshData: true,
	fetching: IDLE,
	fetchingError: null,
  posting: IDLE,
  postingError: null,
}

export const fetchCurrentTournament = createAsyncThunk(
	'tournament/fetchCurrentTournament',
	async (id) => {
		const response = await TournamentDataService.get(id);
		if (response.ok) {
			const tournament = await response.json();
			return { tournament };
		}
	}
);

export const updateCurrentTournament = createAsyncThunk(
	'tournaments/updateCurrentTournament',
	async (tournament) => {
		const response = await TournamentDataService.update(tournament);

		if (response.ok) {
			const updatedTournament = await response.json();
			return { updatedTournament };
		}
	}
);

const currentTournamentSlice = createSlice({
	name: 'currentTournament',
	initialState,
	reducers: {
		addRoundToCurrentTournament: (state) => {
			if (!state.data?.rounds || !state.data?.players) {
				console.error('currentTournament reducer: addRoundToCurrentTournament action: data, rounds or players is null or undefined!');
				return;
			}

			const newRound = {
				id: state.data.rounds.length + 1,
				status: NOT_STARTED
			};
			state.data.rounds.push(newRound);

			state.data.players.forEach((player) => {
				player.scores[newRound.id] = null;
			});
    },
		addPlayerToCurrentTournament: (state, action) => {
			if (!state.data?.rounds || !state.data?.players) {
				console.error('currentTournament reducer: addPlayerToCurrentTournament action: data, rounds or players is null or undefined!');
				return;
			}

			const newPlayerScores = {};
			state.data.rounds.forEach((round) => {
				newPlayerScores[round.id.toString()] = null;
			});
			const newPlayer = {
				id: state.data.players.length + 1,
				name: action.payload,
				scores: newPlayerScores,
				pastOpponents: []
			}
			state.data.players.push(newPlayer);
    },
		setPlayerScoreInRound: (state, action) => {
			if (!state.data?.rounds || !state.data?.players) {
				console.error('currentTournament reducer: setPlayerScoreInRound action: data, rounds or players is null or undefined!');
				return;
			}
			const { playerId, roundId, score } = action.payload;

			const targetPlayer = state.data.players.find((player) => player?.id.toString() === playerId.toString());
			if (!targetPlayer) {
				console.error('currentTournament reducer: setPlayerScoreInRound action: player was not found!');
				return;
			}

			targetPlayer.scores[roundId] = score;
		},
		startTournament: (state) => {
			if (!state.data?.rounds || !state.data?.players || !state.data?.pairings) {
				console.error('currentTournament reducer: startTournament action: data, rounds, players or pairings are null or undefined!');
				return;
			}

			state.data.rounds.forEach((round, index) => {
				if (index === 0) {
					round.status = IN_PROGRESS;
					return;
				}
				round.status = NOT_STARTED;
			})
			
			const roundOnePairings = {
				roundId: state.data?.rounds[0].id,
				matchups: getRandomMatchups(state.data.players)
			}

			console.log(roundOnePairings);
			state.data.pairings = [roundOnePairings];
		},
		startNewRound: (state) => {
			if (!state.data?.rounds || !state.data?.players) {
				console.error('currentTournament reducer: startNewRound action: data, rounds or players is null or undefined!');
				return;
			}

			state.data.players.forEach((player) => {
				player.totalScore = state.data.rounds.reduce(
					(sum, round) => {
						const roundScore = player.scores[round.id];
						if (round.status === NOT_STARTED || roundScore === null || roundScore === undefined) {
							return sum;
						}
						return sum + player.scores[round.id]
					}, 0
				);
			})
			
			const indexOfCurrentRound = state.data.rounds.findIndex((round) => round.status === IN_PROGRESS);
			if (indexOfCurrentRound < 0) {
				state.data.rounds[0].status = IN_PROGRESS;
			} else {
				state.data.rounds[indexOfCurrentRound].status = FINISHED;
				if (indexOfCurrentRound < state.data.rounds.length - 1) {
					state.data.rounds[indexOfCurrentRound + 1].status = IN_PROGRESS;
				}
			}

			const roundPairings = {
				roundId: state.data?.rounds[indexOfCurrentRound + 1].id,
				matchups: null
			}
			if (allOpponentsPlayed(state.data?.players[0], state.data?.players?.length)) {
				console.info('All matchups already played. Pairings for this round are random');
				roundPairings.matchups = getRandomMatchups(state.data.players);
				sortPlayersByTotalScore(state.data.players);
			} else {
				sortPlayersByTotalScore(state.data.players);
				roundPairings.matchups = getNewMatchups(state.data.players);
			}

			console.log(roundPairings);
			state.data.pairings.push(roundPairings);
		},
		endTournament: (state) => {
			if (!state.data?.rounds || !state.data?.players) {
				console.error('currentTournament reducer: endTournament action: data, rounds or players is null or undefined!');
				return;
			}

			state.data.rounds.forEach((round, index) => {
				round.status = FINISHED;
			});

			state.data.players.forEach((player) => {
				player.totalScore = state.data.rounds.reduce(
					(sum, round) => {
						const roundScore = player.scores[round.id];
						if (roundScore === null || roundScore === undefined) {
							return sum;
						}
						return sum + player.scores[round.id]
					}, 0
				);
			});
			state.data.players.sort((playerA, playerB) => playerB.totalScore - playerA.totalScore);
		},
	},
	extraReducers: {
		// fetchCurrentTournament
		[fetchCurrentTournament.pending]: state => {
			state.fetchingData = PENDING;
			state.fetchingErrorData = null;
    },
    [fetchCurrentTournament.rejected]: (state, action) => {
      state.fetchingErrorData = action.error.message;
			state.refreshData = true;
			state.fetchingData = FAILED;
    },
		[fetchCurrentTournament.fulfilled]: (state, action) => {
			state.fetchingErrorData = null;
			state.data = action.payload.tournament;
			state.refreshData = false;
			state.fetchingData = SUCCEEDED;
		},
		// updateCurrentTournament
		[updateCurrentTournament.pending]: state => {
      state.posting = PENDING;
      state.postingError = null;
    },
    [updateCurrentTournament.rejected]: (state, action) => {
      state.postingError = action.error.message;
			state.refreshData = true;
			state.posting = FAILED;
    },
		[updateCurrentTournament.fulfilled]: (state, action) => {
      state.postingError = null;
      state.data = action.payload.updatedTournament;
			state.refreshData = false;
			state.posting = SUCCEEDED;
		},
	},
});

export const { addRoundToCurrentTournament, addPlayerToCurrentTournament, setPlayerScoreInRound, startTournament, startNewRound, endTournament } = currentTournamentSlice.actions;
export default currentTournamentSlice.reducer;

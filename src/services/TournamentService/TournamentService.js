import { TournamentsEndpoints } from '../../consts/apiConfig';

const TournamentDataService = {
  getAll: () => {
    return fetch(TournamentsEndpoints.getFetchTournamentsUrl());
  },
  get: (id) => {
    return fetch(TournamentsEndpoints.getFetchTournamentUrl(id))
  },
  create: (data) => {
    return fetch(TournamentsEndpoints.getPostTournamentUrl(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
        name: data.name,
        added: new Date(),
        rounds: [],
        players: [],
        pairings: []
      }),
    })
  },
  update: (data) => {
    return fetch(TournamentsEndpoints.getPutTournamentUrl(data.id), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
    })
  }
}

export default TournamentDataService;

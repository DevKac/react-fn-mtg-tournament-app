const apiUrl = 'http://localhost:3004';

export const TournamentsEndpoints = {
  getFetchTournamentsUrl: () => apiUrl + '/tournaments',
  getFetchTournamentUrl: (id) => apiUrl + '/tournaments/' + id,
  getPostTournamentUrl: () => apiUrl + '/tournaments',
  getPutTournamentUrl: (id) => apiUrl + '/tournaments/' + id,
}

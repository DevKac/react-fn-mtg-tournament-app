import { shuffleArray } from '../TablesHelper/TablesHelper';

export const sortPlayersByTotalScore = (players) => {
  if (!players) {
    console.error('sortPlayersByTotalScore: players are null or undefined');
    return;
  }

  players.sort((playerA, playerB) => playerB.totalScore - playerA.totalScore);
}

export const allOpponentsPlayed = (player, playersLength) => {
  if (!player) {
    console.error('allOpponentsPlayed: player is null or undefined');
    return false;
  }

  return player.pastOpponents.length + 1 >= playersLength;

}

export const getRandomMatchups = (players) => {
  if (!players) {
    console.error('getRandomMatchups: players are null or undefined');
    return;
  }
  
  players = shuffleArray(players);
  
  const matchups = [];

  for(let i = 0; i < players.length; i = i+2) {
    matchups.push({
      id: Math.floor(i/2),
      playerA: players[i]?.id,
      playerB: players[i+1]?.id
    })
    players[i]?.pastOpponents.push(players[i+1]?.id);
    players[i+1]?.pastOpponents.push(players[i]?.id);
  }

  return matchups
}

export const getNewMatchups = (players) => {
  if (!players) {
    console.error('getNewMatchups: players are null or undefined');
    return;
  }
  
  const matchups = [];
  const pairedPlayerIds = [];
  let matchupId = 0;

  players.forEach((player) => {
    if (!player) {
      console.error('getNewMatchups: one or more players are null or undefied');
      return;
    }
    
    if (pairedPlayerIds.includes(player.id)) {
      return;
    }
    const newOpponent = players.find((opponent) => {
      if (!opponent) {
        console.error('getNewMatchups: one or more players are null or undefied');
        return false;
      }
      
      if (player.id === opponent.id) {
        return false;
      }
      if (pairedPlayerIds.includes(opponent.id)) {
        return false;
      }
      return !player.pastOpponents.includes(opponent.id);
    })

    if (!newOpponent) {
      matchups.push({
        id: matchupId,
        playerA: player.id,
        playerB: null
      })
      pairedPlayerIds.push(player.id);
      player.pastOpponents.push(null);
      matchupId++;
      return;
    }

    matchups.push({
      id: matchupId,
      playerA: player.id,
      playerB: newOpponent.id
    })
    pairedPlayerIds.push(player.id, newOpponent.id);
    player.pastOpponents.push(newOpponent.id);
    newOpponent.pastOpponents.push(player.id);
    matchupId++
  });

  return matchups;
}

export interface ITraditionalStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  minutesPlayed: number;
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPercentage: number;
  threePointMade: number;
  threePointAttempted: number;
  threePointPercentage: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  freeThrowPercentage: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  turnovers: number;
  steals: number;
  blocks: number;
  blockedFieldGoalAttempts: number;
  personalFouls: number;
  personalFoulsDrawn: number;
  plusMinus: number;
}

export interface IPlayerTraditionalStats extends ITraditionalStats {
  playerId: number;
  playerName: string;
  teamId: string;
  teamAbbreviation: string;
  age: string;
}

export interface ITeamTraditionalStats extends ITraditionalStats {
  teamId: number;
  teamName: string;
}

export interface IPlayerBoxScoreTraditionalStats extends Omit<IPlayerTraditionalStats, 'age'> {
  gameId: number;
  gameDate: Date;
  matchup: string;
  winLoss: 'W' | 'L';
}

type PlayerTraditionalStatsOnly = Omit<IPlayerTraditionalStats, keyof ITraditionalStats>;
type TeamTraditionalStatsOnly = Omit<ITeamTraditionalStats, keyof ITraditionalStats>;
type PlayerBoxScoreTraditionalStatsOnly = Omit<IPlayerBoxScoreTraditionalStats, keyof IPlayerTraditionalStats>;

function mapRowSetValue(rowSet: any[], headers: string[], headerKey: string): any {
  let rowSetIndex = headers.indexOf(headerKey);
  return rowSetIndex === -1
    ? null
    : rowSet[rowSetIndex];
}

function mapRowSetToTraditionalStats(rowSet: any[], headers: string[]): ITraditionalStats {
  return {
    gamesPlayed: mapRowSetValue(rowSet, headers, 'GP'),
    wins: mapRowSetValue(rowSet, headers, 'W'),
    losses: mapRowSetValue(rowSet, headers, 'L'),
    minutesPlayed: mapRowSetValue(rowSet, headers, 'MIN'),
    points: mapRowSetValue(rowSet, headers, 'PTS'),
    fieldGoalsMade: mapRowSetValue(rowSet, headers, 'FGM'),
    fieldGoalsAttempted: mapRowSetValue(rowSet, headers, 'FGA'),
    fieldGoalPercentage: mapRowSetValue(rowSet, headers, 'FG_PCT'),
    threePointMade: mapRowSetValue(rowSet, headers, 'FG3M'),
    threePointAttempted: mapRowSetValue(rowSet, headers, 'FG3A'),
    threePointPercentage: mapRowSetValue(rowSet, headers, 'FG3A_PCT'),
    freeThrowsMade: mapRowSetValue(rowSet, headers, 'FTM'),
    freeThrowsAttempted: mapRowSetValue(rowSet, headers, 'FTA'),
    freeThrowPercentage: mapRowSetValue(rowSet, headers, 'FT_PCT'),
    offensiveRebounds: mapRowSetValue(rowSet, headers, 'OREB'),
    defensiveRebounds: mapRowSetValue(rowSet, headers, 'DREB'),
    assists: mapRowSetValue(rowSet, headers, 'AST'),
    turnovers: mapRowSetValue(rowSet, headers, 'TOV'),
    steals: mapRowSetValue(rowSet, headers, 'STL'),
    blocks: mapRowSetValue(rowSet, headers, 'BLK'),
    blockedFieldGoalAttempts: mapRowSetValue(rowSet, headers, 'BLKA'),
    personalFouls: mapRowSetValue(rowSet, headers, 'PF'),
    personalFoulsDrawn: mapRowSetValue(rowSet, headers, 'PFD'),
    plusMinus: mapRowSetValue(rowSet, headers, 'PLUS_MINUS'),
  }
}

export function mapRowSetToPlayerTraditionalStats(rowSet: any[], headers: string[]): IPlayerTraditionalStats {
  return Object.assign<PlayerTraditionalStatsOnly, ITraditionalStats>({
    playerId: mapRowSetValue(rowSet, headers, 'PLAYER_ID'),
    playerName: mapRowSetValue(rowSet, headers, 'PLAYER_NAME'),
    teamId: mapRowSetValue(rowSet, headers, 'TEAM_ID'),
    teamAbbreviation: mapRowSetValue(rowSet, headers, 'TEAM_ABBREVIATION'),
    age: mapRowSetValue(rowSet, headers, 'AGE'),
  }, mapRowSetToTraditionalStats(rowSet, headers));
}

export function mapRowSetToTeamTraditionalStats(rowSet: any[], headers: string[]): ITeamTraditionalStats {
  return Object.assign<TeamTraditionalStatsOnly, ITraditionalStats>({
    teamId: mapRowSetValue(rowSet, headers, 'TEAM_ID'),
    teamName: mapRowSetValue(rowSet, headers, 'TEAM_NAME'),
  }, mapRowSetToTraditionalStats(rowSet, headers));
}

export function mapRowSetToPlayerBoxScoreTraditionalStats(rowSet: any[], headers: string[]): IPlayerBoxScoreTraditionalStats {
  return Object.assign<PlayerBoxScoreTraditionalStatsOnly, IPlayerTraditionalStats>({
    gameId: mapRowSetValue(rowSet, headers, 'GAME_ID'),
    gameDate: mapRowSetValue(rowSet, headers, 'GAME_DATE'),
    matchup: mapRowSetValue(rowSet, headers, 'MATCHUP'),
    winLoss: mapRowSetValue(rowSet, headers, 'WL'),
  }, mapRowSetToPlayerTraditionalStats(rowSet, headers));
}
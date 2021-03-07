export interface ITraditionalStats {
  id: number;
  name: string;
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

function mapRowSetValue(rowSet: any[], headers: string[], headerKey: string): any {
  let rowSetIndex = headers.indexOf(headerKey);
  return rowSetIndex === -1
    ? null
    : rowSet[rowSetIndex];
}

export function mapRowSetToTraditionalStats(rowSet: any[], headers: string[]) {
  return {
    id: mapRowSetValue(rowSet, headers, 'TEAM_ID'),
    name: mapRowSetValue(rowSet, headers, 'TEAM_NAME'),
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
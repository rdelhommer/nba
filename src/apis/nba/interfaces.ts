export interface INbaApiResultSet {
  name: string;
  headers: string[];
  rowSet: any[][];
}

export interface INbaApiResponse {
  resource: string;
  parameters: object;
  resultSets: INbaApiResultSet[];
}

export interface CreateGameTemplateDTO {
  name: string;
  teamSize: number;
  maxMembers: number;
  allowedSeriesLengths: number[];
  supportedPlatforms: string[];
  resultProvider: string;
}
import { InvalidGameRulesError } from '../exceptions/InvalidGameRulesError';

export const SUPPORTED_PLATFORMS = ['steam', 'epic', 'xbox', 'playstation', 'switch'] as const;
export type GamePlatform = (typeof SUPPORTED_PLATFORMS)[number];

const MAX_ROSTER_SIZE = 20;
const PROVIDER_PATTERN = /^[a-z0-9_-]{2,50}$/;

export interface GameRulesProps {
  teamSize: number;
  maxMembers: number;
  allowedSeriesLengths: number[];
  supportedPlatforms: string[];
  resultProvider: string;
}

function isPlatform(value: unknown): value is GamePlatform {
  return SUPPORTED_PLATFORMS.includes(value as GamePlatform);
}

export class GameRules {
  public readonly teamSize: number;
  public readonly maxMembers: number;
  public readonly allowedSeriesLengths: readonly number[];
  public readonly supportedPlatforms: readonly GamePlatform[];
  public readonly resultProvider: string;

  constructor(props: GameRulesProps) {
    if (!Number.isInteger(props.teamSize) || props.teamSize < 1) {
      throw new InvalidGameRulesError('El tamaño del equipo debe ser un entero mayor o igual a 1');
    }

    if (!Number.isInteger(props.maxMembers) || props.maxMembers < props.teamSize) {
      throw new InvalidGameRulesError(
        'El máximo de integrantes debe ser un entero mayor o igual al tamaño del equipo',
      );
    }

    if (props.maxMembers > MAX_ROSTER_SIZE) {
      throw new InvalidGameRulesError(`El máximo de integrantes no puede superar ${MAX_ROSTER_SIZE}`);
    }

    const series = props.allowedSeriesLengths;
    if (
      !Array.isArray(series) ||
      series.length === 0 ||
      !series.every((length) => Number.isInteger(length) && length > 0 && length % 2 === 1)
    ) {
      throw new InvalidGameRulesError(
        'Las series permitidas deben ser una lista no vacía de enteros impares positivos (1, 3, 5, ...)',
      );
    }
    if (new Set(series).size !== series.length) {
      throw new InvalidGameRulesError('Las series permitidas no pueden repetirse');
    }

    const platforms = props.supportedPlatforms;
    if (!Array.isArray(platforms) || platforms.length === 0 || !platforms.every(isPlatform)) {
      throw new InvalidGameRulesError(
        `Las plataformas deben ser una lista no vacía con valores de: ${SUPPORTED_PLATFORMS.join(', ')}`,
      );
    }
    if (new Set(platforms).size !== platforms.length) {
      throw new InvalidGameRulesError('Las plataformas soportadas no pueden repetirse');
    }

    const provider = typeof props.resultProvider === 'string' ? props.resultProvider.trim().toLowerCase() : '';
    if (!PROVIDER_PATTERN.test(provider)) {
      throw new InvalidGameRulesError(
        'El proveedor de resultados debe tener entre 2 y 50 caracteres (letras, números, guion o guion bajo)',
      );
    }

    this.teamSize = props.teamSize;
    this.maxMembers = props.maxMembers;
    this.allowedSeriesLengths = [...series].sort((a, b) => a - b);
    this.supportedPlatforms = [...platforms];
    this.resultProvider = provider;
  }
}
import { basePlatformerCode } from './base-platformer';
import { baseAdventureCode } from './base-adventure';
import { basePuzzleCode } from './base-puzzle';
import { baseShooterCode } from './base-shooter';
import { baseArcadeCode } from './base-arcade';
import { baseRPGCode } from './base-rpg';
import { baseRacingCode } from './base-racing';
import { baseEducationalCode } from './base-educational';
import { GameTemplate, TemplateCategory } from '../game-templates';

const BASE_CODE_MAP: Record<TemplateCategory, string> = {
  platformer: basePlatformerCode,
  adventure: baseAdventureCode,
  puzzle: basePuzzleCode,
  rpg: baseRPGCode,
  shooter: baseShooterCode,
  racing: baseRacingCode,
  educational: baseEducationalCode,
  arcade: baseArcadeCode,
};

const DIFFICULTY_MAP = {
  beginner: 0.7,
  intermediate: 1.0,
  advanced: 1.4,
};

const COLOR_MAP: Record<string, { player: string; enemy: string }> = {
  hopeful: { player: '#3498db', enemy: '#e74c3c' },
  gritty: { player: '#95a5a6', enemy: '#7f8c8d' },
  heroic: { player: '#f39c12', enemy: '#8e44ad' },
};

interface InjectionParams {
  template: GameTemplate;
  playerName?: string;
  enemyName?: string;
  goal?: string;
  tone?: 'hopeful' | 'gritty' | 'heroic';
}

export function injectTemplateCode(params: InjectionParams): string {
  const { template, playerName, enemyName, goal, tone } = params;
  
  // Get base code for category
  let code = BASE_CODE_MAP[template.category];
  
  if (!code) {
    throw new Error(`No base code found for category: ${template.category}`);
  }
  
  // Get colors based on tone
  const toneColors = tone ? COLOR_MAP[tone] : { player: '#3498db', enemy: '#e74c3c' };
  
  // Prepare replacements
  const replacements: Record<string, string> = {
    '{{GAME_TITLE}}': template.name,
    '{{PLAYER_NAME}}': playerName || 'Hero',
    '{{ENEMY_NAME}}': enemyName || 'Enemy',
    '{{GOAL}}': goal || template.description,
    '{{PLAYER_COLOR}}': toneColors.player,
    '{{ENEMY_COLOR}}': toneColors.enemy,
    '{{DIFFICULTY_MULTIPLIER}}': DIFFICULTY_MAP[template.difficulty].toString(),
    '{{GRID_SIZE}}': template.difficulty === 'beginner' ? '6' : template.difficulty === 'intermediate' ? '8' : '10',
  };
  
  // Perform replacements
  Object.entries(replacements).forEach(([placeholder, value]) => {
    code = code.replaceAll(placeholder, value);
  });
  
  return code;
}

export function getBaseCodeForCategory(category: TemplateCategory): string {
  return BASE_CODE_MAP[category] || '';
}


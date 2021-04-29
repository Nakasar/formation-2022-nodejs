import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { HeroDto } from './hero.dto';

class ValidationError extends Error {
  public readonly errors: unknown[];

  constructor({ message, errors }: { message: string; errors: unknown[] }) {
    super(message);
    this.errors = errors;
  }
}

export async function validateHero(
  heroData: Record<string, unknown>,
): Promise<HeroDto> {
  const hero = plainToClass(HeroDto, heroData);
  const validationResult = await validate(hero);
  if (validationResult.length > 0) {
    const error = new ValidationError({
      message: 'Hero is not valid.',
      errors: validationResult,
    });

    throw error;
  }

  return hero;
}

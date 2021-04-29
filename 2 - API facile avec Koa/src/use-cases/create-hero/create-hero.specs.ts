import { CreateHeroUseCase } from './create-hero.use-case';
import { HeroesInMemoryRepository } from '../../services/heroes/heroes-in-memory.repository';
import { Hero } from '../../services/heroes/hero.entity';
import { HeroValidationError } from './hero.validator';

describe('Use-Case - Create Hero', () => {
  let heroesService: HeroesInMemoryRepository;
  let createHeroUseCase: CreateHeroUseCase;

  beforeEach(() => {
    heroesService = new HeroesInMemoryRepository();
    createHeroUseCase = new CreateHeroUseCase(heroesService);
  });

  describe('when hero is not valid', () => {
    test('throws a validation rrror', async () => {
      await expect(
        createHeroUseCase.execute({
          data: {
            name: 'super hero',
          },
        }),
      ).rejects.toThrow(HeroValidationError);
    });
  });

  describe('when hero is valid', () => {
    test('create a new Hero in datastore', async () => {
      await expect(
        createHeroUseCase.execute({
          data: {
            name: 'super hero',
            power: 'super power',
            description: 'super description',
          },
        }),
      ).resolves.toBeInstanceOf(Hero);
    });
  });
});

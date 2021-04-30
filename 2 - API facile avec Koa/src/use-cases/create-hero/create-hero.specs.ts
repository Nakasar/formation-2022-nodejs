import { v4 as uuid } from 'uuid';

import {
  CreateHeroUseCase,
  OperationDeniedError,
} from './create-hero.use-case';
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

  describe('when user is not authenticated', () => {
    test('throws an OperationDeniedError', async () => {
      await expect(
        createHeroUseCase.execute({
          data: {},
          context: {},
        }),
      ).rejects.toThrow(OperationDeniedError);
    });
  });

  describe('when user is authenticated', () => {
    describe('when hero is not valid', () => {
      test('throws a validation rrror', async () => {
        await expect(
          createHeroUseCase.execute({
            data: {
              name: 'super hero',
            },
            context: {
              user: {
                userId: uuid(),
              },
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
            context: {
              user: {
                userId: uuid(),
              },
            },
          }),
        ).resolves.toBeInstanceOf(Hero);
      });
    });
  });
});

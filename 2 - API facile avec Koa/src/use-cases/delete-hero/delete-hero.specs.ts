import { v4 as uuid } from 'uuid';

import { DeleteHeroUseCase } from './delete-hero.use-case';
import { HeroesInMemoryRepository } from '../../services/heroes/heroes-in-memory.repository';
import { Hero } from '../../services/heroes/hero.entity';

describe('Use-Case - Delete Hero', () => {
  let heroesService: HeroesInMemoryRepository;
  let deleteHeroUseCase: DeleteHeroUseCase;

  beforeEach(() => {
    heroesService = new HeroesInMemoryRepository();
    deleteHeroUseCase = new DeleteHeroUseCase(heroesService);
  });

  describe('when hero does not exist', () => {
    test('throws an error for non existing hero', async () => {
      await expect(
        deleteHeroUseCase.execute({
          heroId: uuid(),
        }),
      ).rejects.toThrow('Hero does not exist.');
    });
  });

  describe('when hero does exist', () => {
    let heroId: string;
    beforeEach(async () => {
      const hero = Hero.create({
        id: uuid(),
        name: 'Test',
        power: 'SuperTest',
        description: 'Super text',
      });

      await heroesService.createHero(hero);
    });

    test('deletes the hero', async () => {
      await expect(
        deleteHeroUseCase.execute({
          heroId: uuid(),
        }),
      ).resolves.toBeUndefined;

      await expect(heroesService.getHeroById(heroId)).resolves.toBeNull;
    });
  });
});

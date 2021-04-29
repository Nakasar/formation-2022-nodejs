import { Hero } from '../../services/heroes/hero.entity';
import { HeroesGateway } from '../../services/heroes/heroes.gateway';

export class NonExistingHero extends Error {}

export class GetHeroUseCase {
  constructor(private readonly heroesService: HeroesGateway) {}

  async execute(port: { heroId: string }): Promise<Hero> {
    const hero = await this.heroesService.getHeroById(port.heroId);

    if (!hero) {
      throw new NonExistingHero();
    }

    return hero;
  }
}

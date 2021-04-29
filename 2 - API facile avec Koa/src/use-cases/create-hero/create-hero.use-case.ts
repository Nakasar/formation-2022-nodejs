import { Hero } from '../../services/heroes/hero.entity';
import { HeroesGateway } from '../../services/heroes/heroes.gateway';
import { validateHero } from './hero.validator';

export class CreateHeroUseCase {
  constructor(private readonly heroesService: HeroesGateway) {}
  async execute(port: { data: Record<string, unknown> }): Promise<Hero> {
    const heroDto = await validateHero({
      ...port.data,
    });

    const hero = Hero.create(heroDto);

    await this.heroesService.createHero(hero);

    return hero;
  }
}

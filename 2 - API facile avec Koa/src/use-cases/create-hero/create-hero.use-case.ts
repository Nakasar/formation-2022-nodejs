import { Hero } from '../../services/heroes/hero.entity';
import { HeroesGateway } from '../../services/heroes/heroes.gateway';
import { validateHero } from './hero.validator';

export class OperationDeniedError extends Error {}

export class CreateHeroUseCase {
  constructor(private readonly heroesService: HeroesGateway) {}
  async execute(port: {
    data: Record<string, unknown>;
    context: { user?: { userId: string } };
  }): Promise<Hero> {
    await this.guardUserIsAuthenticated(port.context.user);

    const heroDto = await validateHero({
      ...port.data,
    });

    const hero = Hero.create(heroDto);

    await this.heroesService.createHero(hero);

    return hero;
  }

  async guardUserIsAuthenticated(user?: { userId: string }): Promise<void> {
    if (!user?.userId) {
      throw new OperationDeniedError();
    }
  }
}

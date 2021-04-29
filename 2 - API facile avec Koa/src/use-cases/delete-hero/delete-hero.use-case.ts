import { HeroesGateway } from '../../services/heroes/heroes.gateway';

export class DeleteHeroUseCase {
  constructor(private readonly heroesService: HeroesGateway) {}

  async execute(port: { heroId: string }): Promise<void> {
    await this.heroesService.deleteHeroById(port.heroId);
  }
}

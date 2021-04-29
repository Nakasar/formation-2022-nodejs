import { HeroesGateway } from '../../services/heroes/heroes.gateway';

export class GetHeroesSummarizedUseCase {
  constructor(private readonly heroesService: HeroesGateway) {}

  async execute(): Promise<{ id: string; name: string }[]> {
    return this.heroesService.getHeroesSummarized();
  }
}

import { cloneDeep } from 'lodash';

import { Hero } from './hero.entity';
import { HeroesGateway } from './heroes.gateway';

export class HeroesInMemoryRepository implements HeroesGateway {
  private heroes: Hero[] = [];

  async getHeroById(id: string): Promise<Hero | null> {
    const hero = this.heroes.find((candidate) => candidate.id === id);

    if (!hero) {
      return null;
    }

    return cloneDeep(hero);
  }

  async getHeroesSummarized(): Promise<{ id: string; name: string }[]> {
    return this.heroes.map((hero) => ({ id: hero.id, name: hero.name }));
  }

  async createHero(hero: Hero): Promise<Hero> {
    this.heroes.push(cloneDeep(hero));

    return hero;
  }

  async deleteHeroById(id: string): Promise<void> {
    const heroIndex = this.heroes.findIndex((candidate) => candidate.id === id);

    if (heroIndex === -1) {
      throw new Error('Hero does not exist.');
    }

    this.heroes.splice(heroIndex, 1);
  }
}

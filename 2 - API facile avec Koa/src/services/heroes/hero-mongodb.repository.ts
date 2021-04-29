import { Db as MongoDB } from 'mongodb';
import { Hero } from './hero.entity';
import { HeroesGateway } from './heroes.gateway';

export class HeroesMongodbRepository implements HeroesGateway {
  constructor(private readonly db: MongoDB) {}

  async getHeroById(id: string): Promise<Hero | null> {
    const heroOrNull = await this.db.collection('heroes').findOne({
      heroId: id,
    });

    if (!heroOrNull) {
      return null;
    }

    return Hero.create(heroOrNull);
  }

  async createHero(hero: Hero): Promise<Hero> {
    await this.db.collection('heroes').insertOne({
      heroId: hero.id,
      name: hero.name,
      power: hero.power,
      description: hero.description,
    });

    return hero;
  }

  async deleteHeroById(id: string): Promise<void> {
    const result = await this.db.collection('heroes').deleteOne({ heroId: id });

    if (result.result.n === 0) {
      throw new Error('Hero does not exist.');
    }
  }

  async getHeroesSummarized(): Promise<{ id: string; name: string }[]> {
    const heroes = await this.db
      .collection('heroes')
      .find({}, { projection: { _id: 0, heroId: 1, name: 1 } })
      .toArray();

    return heroes.map((hero) => ({
      id: hero.heroId,
      name: hero.name,
    }));
  }
}

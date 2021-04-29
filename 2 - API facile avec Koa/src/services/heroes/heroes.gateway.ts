import { Hero } from './hero.entity';

export interface HeroesGateway {
  /**
   * Get a Hero by its ID.
   * @param id
   */
  getHeroById(id: string): Promise<Hero | null>;

  /**
   * Create a Hero.
   * @param hero
   */
  createHero(hero: Hero): Promise<Hero>;

  /**
   * Delete a Hero
   * @param id
   */
  deleteHeroById(id: string): Promise<void>;

  /**
   * Get summarized heroes (id and name).
   * Pagination not implemented (if you have time ;) ).
   */
  getHeroesSummarized(): Promise<{ id: string; name: string }[]>;
}

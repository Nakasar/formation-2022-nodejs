import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { HeroesInMemoryRepository } from './services/heroes/heroes-in-memory.repository';
import { GetHeroesSummarizedUseCase } from './use-cases/get-heroes/get-heroes.use-case';
import { GetHeroUseCase } from './use-cases/get-hero/get-hero.use-case';
import { DeleteHeroUseCase } from './use-cases/delete-hero/delete-hero.use-case';
import { CreateHeroUseCase } from './use-cases/create-hero/create-hero.use-case';
import { HeroesController } from './controllers/heroes/heroes.controller';

export interface ApplicationConfiguration {
  port: number;
}

export class Application {
  private app?: Koa;

  constructor(private readonly configuration: ApplicationConfiguration) {}

  async start(): Promise<void> {
    // Initialized repositories (driven adapters)
    const heroesRepository = new HeroesInMemoryRepository();

    // Initialize use-cases
    const createHero = new CreateHeroUseCase(heroesRepository);
    const deleteHeroUseCase = new DeleteHeroUseCase(heroesRepository);
    const getHeroesSummarizedUseCase = new GetHeroesSummarizedUseCase(
      heroesRepository,
    );
    const getHeroUseCase = new GetHeroUseCase(heroesRepository);

    // Initialize controllers (driving adapters)

    const heroesController = new HeroesController(
      createHero,
      deleteHeroUseCase,
      getHeroesSummarizedUseCase,
      getHeroUseCase,
    );

    this.app = new Koa();
    this.app.use(bodyParser());

    // Un logger bonus pour afficher toutes les requêtes traitées.
    this.app.use(async (ctx, next) => {
      ctx.startDate = new Date();
      console.log({
        text: 'Request received.',
        symbol: 'REQUEST_RECEIVED',
        startDate: ctx.startDate.toISOString(),
        path: ctx.path,
      });

      try {
        await next();
      } catch (error) {
        const endDate = new Date();

        console.log({
          text: 'Request generated an error.',
          symbol: 'REQUEST_CONCLUDED',
          status: ctx.status || 500,
          endDate: endDate.toISOString(),
          duration: endDate.getTime() - ctx.startDate.getTime(),
        });

        throw error;
      }

      const onfinish = done.bind(null, 'finish');
      const onclose = done.bind(null, 'close');

      ctx.res.once('finish', onfinish);
      ctx.res.once('close', onclose);

      function done() {
        ctx.res.removeListener('finish', onfinish);
        ctx.res.removeListener('close', onclose);

        const endDate = new Date();

        console.log({
          text: 'Request concluded successfully.',
          symbol: 'REQUEST_CONCLUDED',
          status: ctx.status,
          endDate: endDate.toISOString(),
          duration: endDate.getTime() - ctx.startDate.getTime(),
        });
      }
    });

    const router = new Router();
    heroesController.init(router);

    this.app.use(router.routes()).use(router.allowedMethods());

    this.app.listen(this.configuration.port, () => {
      console.log('Application started');
    });
  }
}

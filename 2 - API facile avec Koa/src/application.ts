import Router from '@koa/router';
import jwt from 'jsonwebtoken';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { MongoClient } from 'mongodb';

import { GetHeroesSummarizedUseCase } from './use-cases/get-heroes/get-heroes.use-case';
import { GetHeroUseCase } from './use-cases/get-hero/get-hero.use-case';
import { DeleteHeroUseCase } from './use-cases/delete-hero/delete-hero.use-case';
import { CreateHeroUseCase } from './use-cases/create-hero/create-hero.use-case';
import { HeroesController } from './controllers/heroes/heroes.controller';
import { HeroesMongodbRepository } from './services/heroes/hero-mongodb.repository';

export interface ApplicationConfiguration {
  port: number;
  authentication: {
    secretKey: string;
  };
  services: {
    mongodb: {
      url: string;
    };
  };
}

export class Application {
  private app?: Koa;

  constructor(private readonly configuration: ApplicationConfiguration) {}

  async start(): Promise<void> {
    // Initialized repositories (driven adapters)
    const client = new MongoClient(this.configuration.services.mongodb.url);
    await client.connect();
    const db = client.db('formation');

    const heroesRepository = new HeroesMongodbRepository(db);

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

    this.app.use(async (ctx, next) => {
      const authorizationHeader = ctx.headers.authorization;

      console.log(authorizationHeader);

      if (!authorizationHeader) {
        ctx.state.user = null;

        return next();
      }

      try {
        const token = authorizationHeader.split('Bearer ')[1];
        if (!token) {
          ctx.status = 403;
          ctx.body = {
            message:
              'Authentication header is not valid according to the bearer scheme.',
          };
          return;
        }

        // verify token
        try {
          const decoded = jwt.verify(
            token,
            this.configuration.authentication.secretKey,
          ) as any;
          ctx.state.user = {
            token: decoded,
            userId: decoded.sub,
          };
          return next();
        } catch (error) {
          ctx.status = 403;
          ctx.body = { message: 'Invalid token provided as authentication.' };
          return;
        }
      } catch (error) {
        console.error();
        ctx.status = 403;
        ctx.message = 'Authentication could not be verified.';
        return;
      }
    });

    const router = new Router();
    heroesController.init(router);

    router.post('/auth', async (ctx) => {
      const { userId } = ctx.request.body;

      if (!userId) {
        ctx.status = 400;
        ctx.body = { message: 'No userID provided.' };
        return;
      }

      const token = jwt.sign(
        {
          sub: userId,
        },
        this.configuration.authentication.secretKey,
        { expiresIn: '1h' },
      );

      ctx.status = 201;
      ctx.body = { token };
    });

    this.app.use(router.routes()).use(router.allowedMethods());

    this.app.listen(this.configuration.port, () => {
      console.log('Application started');
    });
  }
}

import Router from '@koa/router';
import { Context } from 'koa';

import { CreateHeroUseCase } from '../../use-cases/create-hero/create-hero.use-case';
import { HeroValidationError } from '../../use-cases/create-hero/hero.validator';
import { DeleteHeroUseCase } from '../../use-cases/delete-hero/delete-hero.use-case';
import {
  GetHeroUseCase,
  NonExistingHero,
} from '../../use-cases/get-hero/get-hero.use-case';
import { GetHeroesSummarizedUseCase } from '../../use-cases/get-heroes/get-heroes.use-case';

export class HeroesController {
  constructor(
    private readonly createHeroUseCase: CreateHeroUseCase,
    private readonly deleteHeroUseCase: DeleteHeroUseCase,
    private readonly getHeroesSummarizedUseCase: GetHeroesSummarizedUseCase,
    private readonly getHeroUseCase: GetHeroUseCase,
  ) {}

  init(router: Router): Router {
    router.post('/heroes', async (ctx: Context) => {
      try {
        const hero = await this.createHeroUseCase.execute({
          data: ctx.request.body,
        });

        ctx.status = 201;
        ctx.body = hero;
      } catch (error) {
        if (error instanceof HeroValidationError) {
          ctx.status = 404;
          ctx.body = {
            message: error.message,
            errors: error.errors,
          };
          return;
        }

        throw error;
      }
    });

    router.get('/heroes', async (ctx: Context) => {
      const heroesSummarized = await this.getHeroesSummarizedUseCase.execute();

      ctx.status = 206;
      ctx.body = heroesSummarized;
    });

    router.get('/heroes/:heroId', async (ctx: Context) => {
      try {
        const hero = await this.getHeroUseCase.execute({
          heroId: ctx.params.heroId,
        });

        ctx.status = 206;
        ctx.body = hero;
      } catch (error) {
        if (error instanceof NonExistingHero) {
          ctx.status = 404;
          return;
        }

        throw error;
      }
    });

    router.del('/heroes/:heroId', async (ctx: Context) => {
      await this.deleteHeroUseCase.execute({ heroId: ctx.params.heroId });

      ctx.status = 204;
    });

    return router;
  }
}

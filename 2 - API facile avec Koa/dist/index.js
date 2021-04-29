"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const uuid_1 = require("uuid");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
// On prépare un nouveau routeur pour les héros.
const heroRouter = new router_1.default();
const heroes = [
    { id: uuid_1.v4(), name: 'Superman', power: 'Laser', description: 'The Superman' },
];
heroRouter.get('/heroes', (ctx) => {
    ctx.status = 206;
    ctx.body = heroes.map((hero) => ({
        id: hero.id,
        name: hero.name,
        href: `/heroes/${hero.id}`, // Ceci est l'URL à appeler pour récupérer le héro complet (cf spécifications complètes des liens dans les requêtes REST).
    }));
});
heroRouter.post('/heroes', (ctx) => {
    const hero = {
        id: uuid_1.v4(),
        name: ctx.request.body.name,
        power: ctx.request.body.power,
        description: ctx.request.body.description,
    };
    heroes.push(hero);
    ctx.status = 201; // 201 = HTTP code "CREATED"
    ctx.body = hero;
});
heroRouter.get('/heroes/:heroId', (ctx) => {
    const hero = heroes.find((candidate) => candidate.id === ctx.params.heroId);
    if (!hero) {
        ctx.status = 404; // 404 = HTTP code "NOT FOUND"
        return;
    }
    ctx.status = 200; // 404 = HTTP code "OK"
    ctx.body = hero;
});
heroRouter.del('/heroes/:heroId', (ctx) => {
    const heroIndex = heroes.findIndex((candidate) => candidate.id === ctx.params.heroId);
    if (heroIndex === -1) {
        ctx.status = 404;
        return;
    }
    heroes.splice(heroIndex, 1);
    ctx.status = 204; // 404 = HTTP code "NO CONTENT" quand le body de la réponse est vide.
});
// On initialise l'application
const app = new koa_1.default();
// Ceci permet d'utiliser le contenu du body de la requête.
app.use(koa_bodyparser_1.default());
// Un logger bonus pour afficher toutes les requêtes traitées.
app.use(async (ctx, next) => {
    ctx.startDate = new Date();
    console.log({
        text: 'Request received.',
        symbol: 'REQUEST_RECEIVED',
        startDate: ctx.startDate.toISOString(),
        path: ctx.path,
    });
    try {
        await next();
    }
    catch (error) {
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
// Ici, on utilise notre routeur défini plus haut.
app.use(heroRouter.routes()).use(heroRouter.allowedMethods());
// Et quand tout est prêt, on démarre le serveur.
app.listen(8080, () => {
    console.info('Application started.');
});
//# sourceMappingURL=index.js.map
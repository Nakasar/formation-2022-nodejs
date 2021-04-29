# Exercice : création d'une API simple

Il s'agit de créer une API simple disposant de quatre routes REST :
* `GET /heroes` pour récupérer la liste résumée des héros avec juste leur ID et leur super-nom (status 206)
* `POST /heroes` pour ajouter un héro dans la liste stockée (status 201)
* `GET /hero/:heroId` pour récupérer les détails d'un héro (status 200)
* `DELETE /hero/:heroID` pour supprimer un héro de la liste (status 204)

Un héro est représenté de la manière suivante au minimum :
* Un super-identifiant unique
* Un super-nom de héro
* Un super-pouvoir
* Une super-description

La liste des héros peut être stockée dans une liste en mémoire.

Si vous êtes rapide, vous pouvez la stocker dans un fichier JSON ou CSV et la charger depuis ce fichier au démarrage de l'application.

Les librairies utiles :
* [koa](https://koajs.com/)
* [@koa/router](https://www.npmjs.com/package/@koa/router)
* nodemon

# Exercice : migrer vers TypeScript

Une fois que vous avez votre API avec les quatres routes ci-dessus, vous pouvez configurer votre projet avec TypeScript.

Commencez par typer votre code en créant une interface pour vos héros et en changeant l'extension de vos fichier en `.ts`, ce qui ne change presque rien à votre code. Mais vous remarquerez que désormais vous devez typer toutes vos fonctions, et que vous ne pouvez pas appeler des propriétés qui n'existent pas sur vos héros (essayez par exemple `console.log(hero.tata);`, qui ne compile plus).

Les librairies utiles :
* typescript
* prettier
* eslint
* @typescript-eslint/eslint-plugin
* @typescript-eslint/parser
* eslint-config-prettier
* eslint-plugin-prettier
* ts-node-dev
* ts-node
* @types/koa__router
* @types/koa-bodyparser

La configuration "basique" pour un projet TypeScript :

`tsconfig.build.json`
```json
{
  "compilerOptions": {
    "outDir": "dist",
    "sourceMap": true,
    "target": "ES2020",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "module": "commonJs"
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

Les configurations "basiques" pour prettier et eslint :

`.prettierrc.js`
```javascript
module.exports = {
  arrowParens: 'always',
  endOfLine: 'lf',
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};
```

`.eslintrc.js`
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {}
};
```

## Exercice : Validation des données

Pour éviter que l'utilisateur n'ajoute des héros au format non valide, vous allez maintenant implémenter une validation des héros.

Créez une fonction `validateHero(heroData: any): Promise<HeroDto>` qui valide un objet JS arbitraire et retourne un objet d'une nouvelle classe `HeroDto` si les données sont valide, ou jette une erreur dans le cas contraire.

Si vous êtes rapide, vous pouvez essayer de faire en sorte que l'API retourne une erreur `400` au lieu d'une erreur `500` lors d'un problème de validation des données.

Librairies utiles :
* class-transformer
* class-validator

## Exercice : Organisation, injection de dépendances, et tests

Maintenant que notre application va prendre de l'ampleur, il est temps de structurer un peu le code et de le rendre plus modulaire. Essayez de séparer votre code pour suivre la structure présentée dans la formation, avec un use-case pour chaque route et un service pour les héros.

## Exercice : Persistence

Pour persister les héros entre les lancements d'application (et de manière plus pérenne que l'écriture dans un fichier), nous allons stocker les héros dans une base de donnée MongoDB.

N'oubliez pas d'écrire de nouveaux tests d'intégration pour la nouvelle implémentation du service pour les héros. Pensez à écrire les tests avant l'implémentation.

Si vous avez bien implémenté l'injection de dépendances, vous ne devriez pas avoir à modifier vos fichiers de use-case. 

Librairies utiles :
* mongodb

Lancer un container docker mongodb :
* `docker run –p 27017:27017 –name mongo –d mongo`

## Exercice : Authentification

Rajoutez maintenant une nouvelle route d'authentification qui génère un JWT pour un ID d'utilisateur, et un nouveau middleware pour valider la signature du JWT et sa date de fin de vie lorsqu'il est présent dans les entêtes de la requête.

Si vous êtes vraiment en avance, vous pouvez créer un nouveau use-case d'enregistrement d'utilisateur avec un mot de passe, et demander un login/mot de passe dans la route d'authentification.

Et n'oubliez pas de modifier les tests de vos use-case AVANT d'implémenter l'authentification !

Librairies utiles :
* jsonwebtoken

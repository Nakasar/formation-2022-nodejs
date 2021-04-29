import { Application } from './application';

export async function start(): Promise<void> {
  const app = new Application({
    port: 8080,
    services: {
      mongodb: {
        url: 'mongodb://localhost:27017',
      },
    },
  });

  await app.start();
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

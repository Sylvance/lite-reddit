import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';


const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [],
      validate: false,
    })
  });
  
  app.get('/', (_, res) => {
    res.send("Hello");
  });

  app.listen(4000, () => {
    console.log("Server started at 4000")
  });

  const post = orm.em.create(Post, { title: 'Hello Post!' });
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts)
};

main().catch((err) => {
  console.error(err);
});


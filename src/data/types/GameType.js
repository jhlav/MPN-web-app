import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { resolver } from 'graphql-sequelize';

import { Game } from '../models';
import PlatformType from './PlatformType';

const GameType = new ObjectType({
  name: 'Game',
  fields: () => ({
    id: { type: new NonNull(ID) },
    name: { type: new NonNull(StringType) },
    platforms: {
      type: new List(PlatformType),
      resolve: resolver(Game.Platforms),
    },
  }),
});

export default GameType;

import DataType from 'sequelize';
import Model from '../sequelize';

const Game = Model.define(
  'Game',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataType.STRING(100),
    },
  },
  {
    indexes: [{ fields: ['name'] }],
  },
);

export default Game;

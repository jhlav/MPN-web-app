/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
import DiscordUser from './DiscordUser';
import Game from './Game';
import GameEntry from './GameEntry';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';

Game.GameEntries = Game.hasMany(GameEntry);
GameEntry.Game = GameEntry.belongsTo(Game);

DiscordUser.GameEntries = DiscordUser.hasMany(GameEntry);
GameEntry.DiscordUser = GameEntry.belongsTo(DiscordUser);

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  DiscordUser,
  Game,
  GameEntry,
  User,
  UserLogin,
  UserClaim,
  UserProfile,
};

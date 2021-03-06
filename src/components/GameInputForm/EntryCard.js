/* eslint-disable global-require, import/no-dynamic-require */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { connect } from 'react-redux';

import Avatar from 'react-md/lib/Avatars';
import Autocomplete from 'react-md/lib/Autocompletes';
import FontIcon from 'react-md/lib/FontIcons';
import SelectField from 'react-md/lib/SelectFields';
import Switch from 'react-md/lib/SelectionControls/Switch';

import NumberInput from '../NumberInput';
import s from './EntryCard.css';

import {
  entrySelectPlayer as selectPlayer,
  entryToggleCpuPlayer as toggleCPU,
  entrySelectCharacter as selectCharacter,
  entrySetStars as setStars,
  entrySetCoins as setCoins,
  entrySetMinigameCoins as setMGCoins,
} from '../../actions/gameInputForm';

@connect(
  state => ({
    charactersAvailable: state.gameInputForm.charactersAvailable,
  }),
  dispatch => ({
    toggleCPU: (entryId, isCPU) => dispatch(toggleCPU(entryId, isCPU)),
    selectCharacter: (entryId, character) =>
      dispatch(selectCharacter(entryId, character)),
    selectPlayer: (entryId, playerTag) =>
      dispatch(selectPlayer(entryId, playerTag)),
    setStars: (entryId, stars) => dispatch(setStars(entryId, stars)),
    setCoins: (entryId, coins) => dispatch(setCoins(entryId, coins)),
    setMGCoins: (entryId, mgCoins) => dispatch(setMGCoins(entryId, mgCoins)),
  }),
)
@withStyles(s)
class EntryCard extends Component {
  static defaultProps = {
    character: '',
    coins: '0',
    imageURI: require('../_SharedAssets/mushroom.svg'),
    isCPU: false,
    minigameCoins: '0',
    player: {
      id: '',
      avatarURL: require('../_SharedAssets/discord-avatar-default.png'),
      tag: '',
    },
    stars: '0',
  };

  static propTypes = {
    character: PropTypes.string,
    charactersAvailable: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        leftAvatar: PropTypes.node,
      }),
    ).isRequired,
    coins: PropTypes.string,
    imageURI: PropTypes.string,
    isCPU: PropTypes.bool,
    minigameCoins: PropTypes.string,
    place: PropTypes.string.isRequired,
    player: PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatarURL: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
    }),
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatarURL: PropTypes.string.isRequired,
        tag: PropTypes.string.isRequired,
      }),
    ).isRequired,
    selectCharacter: PropTypes.func.isRequired,
    selectPlayer: PropTypes.func.isRequired,
    setCoins: PropTypes.func.isRequired,
    setMGCoins: PropTypes.func.isRequired,
    setStars: PropTypes.func.isRequired,
    stars: PropTypes.string,
    toggleCPU: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (this.props.isCPU !== false) {
      this.props.toggleCPU(this.props.place, false);
    }
  }

  findPlayer = tag => {
    const { place, players } = this.props;
    players.some(player => {
      if (player.tag === tag) {
        this.props.selectPlayer(place, player);
        return true;
      }
      return false;
    });
  };

  generatePlayerList = () => {
    // const playersNoCPU = this.props.players.filter(player => player.id !== '1');
    const list = this.props.players.map(player => ({
      leftAvatar: (
        <Avatar alt={`Avatar for ${player.tag}`} src={player.avatarURL} />
      ),
      name: player.tag,
    }));

    return list;
  };

  toggleCPU = value => {
    const { place, players } = this.props;
    this.props.toggleCPU(place, value);
    this.props.selectCharacter(place, '');
    // Until we find the CPU player, iterate
    // When we do, provide that DiscordUser data and end looping
    players.some(player => {
      if (player.tag === 'CPU') {
        this.props.selectPlayer(place, player);
        return true;
      }
      return false;
    });
  };

  render() {
    const {
      character,
      charactersAvailable,
      coins,
      imageURI,
      isCPU,
      minigameCoins,
      place,
      player,
      stars,
    } = this.props;
    const playerList = this.generatePlayerList();
    let playerAvatar;
    if (player && player.avatarURL) {
      playerAvatar = player.avatarURL;
    } else {
      playerAvatar = require('../_SharedAssets/discord-avatar-default.png');
    }
    return (
      <div className={s.container}>
        <div className={s.playerAvatar}>
          <Avatar alt="Player avatar" src={playerAvatar} />
        </div>
        <div className={s.cpuToggle}>
          <Switch
            id={`cpuToggle-${place}`}
            name={`cpuToggle-${place}`}
            label="CPU"
            onChange={this.toggleCPU}
          />
        </div>
        <div className={s.placeIndex}>
          <FontIcon>
            {`filter_${place}`}
          </FontIcon>
        </div>
        <div className={s.playerSearch}>
          <Autocomplete
            data={playerList}
            dataLabel="name"
            dataValue="name"
            disabled={isCPU}
            focusInputOnAutocomplete={false}
            fullWidth
            id={`searchPeople-${place}`}
            onAutocomplete={tag => this.findPlayer(tag)}
            placeholder="Search by Discord tag"
          />
        </div>
        <div className={s.charAvatar}>
          <img
            alt=""
            src={imageURI || require('../_SharedAssets/mushroom.svg')}
          />
        </div>
        <div className={s.charSelect}>
          <SelectField
            disabled={isCPU}
            helpText="Select a game first"
            id={`characters-${place}`}
            itemLabel="name"
            itemValue="name"
            label="Character"
            menuItems={charactersAvailable}
            onChange={value => this.props.selectCharacter(place, value)}
            placeholder="Select a character"
            value={character}
          />
        </div>
        <div className={s.coinIcon}>
          <img alt="" src={require('../_SharedAssets/coin.png')} />
        </div>
        <div className={s.coinInput}>
          <NumberInput
            id={`coinInput-${place}`}
            label="Coins"
            onChange={value => this.props.setCoins(place, value)}
            value={coins}
          />
        </div>
        <div className={s.mgCoinIcon}>
          <img
            alt="Minigame Coin Icon"
            src={require('../_SharedAssets/coin.png')}
          />
        </div>
        <div className={s.mgCoinInput}>
          <NumberInput
            id={`mgCoinInput-${place}`}
            label="MG Coins"
            onChange={value => this.props.setMGCoins(place, value)}
            value={minigameCoins}
          />
        </div>
        <div className={s.starIcon}>
          <img alt="" src={require('../_SharedAssets/star.png')} />
        </div>
        <div className={s.starInput}>
          <NumberInput
            id={`starInput-${place}`}
            label="Stars"
            onChange={value => this.props.setStars(place, value)}
            value={stars}
          />
        </div>
      </div>
    );
  }
}

export default EntryCard;

import FifthFloorAssets from '../components/fifthFloor.assetMap';
import FourthFloorAssets from '../components/fourthFloor.assetMap';
import { GoogleTimeFrame } from '../googleClient/google.types';

type Assets = typeof FourthFloorAssets & typeof FifthFloorAssets;

type AssetId = keyof Assets;

export interface BaseMapEntity {
  id: AssetId; // used in figma
  parentId: AssetId | null; // id
}
export interface FloorEntity extends BaseMapEntity {
  type: 'FLOOR';
  displayName: string;
  factoryNumber: string | null;
}
export interface AreaEntity extends BaseMapEntity {
  type: 'AREA';
  displayName: string;
  factoryNumber: string | null;
}
export interface BookableRoomEntity extends BaseMapEntity {
  type: 'ROOM';
  displayName: string;
  factoryNumber: string | null;

  category: keyof typeof RoomCategoryData;
  bookable: 'BOOKABLE';
  email: string;
  capacity: number;
  busyTimes?: GoogleTimeFrame[];
}
export interface UnbookableRoomEntity extends BaseMapEntity {
  type: 'ROOM';
  displayName: string;
  factoryNumber: string | null;

  email?: string | null;

  category: keyof typeof RoomCategoryData;
  bookable:
    | 'UNAVAILABLE'
    | 'TEAM_ONLY'
    | 'UNBOOKABLE'
    | 'APPLICATION_REQUIRED'
    | 'APPLICATION_REQUIRED';
}
export type RoomEntity = BookableRoomEntity | UnbookableRoomEntity;

export interface LabelEntity extends BaseMapEntity {
  type: 'LABEL';
}
export interface IconEntity extends BaseMapEntity {
  type: 'ICON';

  category: 'NAVIGATION' | 'DECORATION';
}
export type MapEntity =
  | FloorEntity
  | AreaEntity
  | RoomEntity
  | LabelEntity
  | IconEntity;

export const rooms = {
  Cinema: {
    id: 'Cinema',
    parentId: 'FifthFloor',
    type: 'ROOM',

    bookable: 'UNBOOKABLE',
    displayName: 'Cinema',
    factoryNumber: '5.?',
    category: 'FACTORY_INACCESSIBLE',
  },
  Bar: {
    id: 'Bar',
    parentId: 'FifthFloor',
    type: 'ROOM',

    bookable: 'UNBOOKABLE',
    displayName: 'Bar',
    factoryNumber: '5.?',
    category: 'FACTORY_INACCESSIBLE',
  },
  Dings: {
    id: 'Dings',
    parentId: 'FifthFloor',
    type: 'ROOM',

    bookable: 'UNBOOKABLE',
    displayName: '?',
    factoryNumber: '5.?',
    category: 'FACTORY_INACCESSIBLE',
  },
  Dangs: {
    id: 'Dangs',
    parentId: 'FifthFloor',
    type: 'ROOM',

    bookable: 'UNBOOKABLE',
    displayName: '?',
    factoryNumber: '5.?',
    category: 'FACTORY_INACCESSIBLE',
  },
  Dongs: {
    id: 'Dongs',
    parentId: 'FifthFloor',
    type: 'ROOM',

    bookable: 'UNBOOKABLE',
    displayName: '?',
    factoryNumber: '5.?',
    category: 'FACTORY_INACCESSIBLE',
  },
  FifthFloor: {
    id: 'FifthFloor',
    parentId: null,
    type: 'FLOOR',

    displayName: '5th Floor',
    factoryNumber: '5',
    category: 'FLOOR',
  },
  FourthFloor: {
    id: 'FourthFloor',
    parentId: null,
    type: 'FLOOR',

    displayName: '4th Floor',
    factoryNumber: '4',
    category: 'FLOOR',
  },
  R2: {
    id: 'R2',
    bookable: 'BOOKABLE',
    email: 'c_1889sg0kntgi2hllj05ckqp121enm@resource.calendar.google.com',
    displayName: 'R2',
    factoryNumber: '4.3.1',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 10,
  },
  D2: {
    id: 'D2',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_1883j5g4liq5ihuehfm64pgo3o66g@resource.calendar.google.com',
    displayName: 'D2',
    factoryNumber: '4.2.2',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 10,
  },
  Echo: {
    id: 'Echo',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_188b923imhgm0g6vmhocej0lfi15e6gb74sjachk6cr32dpl68@resource.calendar.google.com',
    displayName: 'Echo',
    factoryNumber: '4.11.12',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 4,
  },
  Zuse: {
    id: 'Zuse',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_1888rqjtdkh70i80n4v45e7km81ua6gb68pjae1k74qjcdhk68@resource.calendar.google.com',
    displayName: 'Zuse',
    factoryNumber: '4.11.10',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 6,
  },
  Warp: {
    id: 'Warp',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_188f2u4uqje8uh9sh50ell5nlacva6gb6op34d9l6sq34chk6g@resource.calendar.google.com',
    displayName: 'Warp',
    factoryNumber: '4.11.11',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 4,
  },
  Ada: {
    id: 'Ada',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_188ff8i403g5ajughddn43j69rl166gb6oo38e9g74s3gchp60@resource.calendar.google.com',
    displayName: 'Ada',
    factoryNumber: '4.11.9',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 4,
  },
  Rick: {
    id: 'Rick',
    bookable: 'BOOKABLE',
    email: 'code.berlin_3736373335323835363837@resource.calendar.google.com',
    displayName: 'Rick',
    factoryNumber: '4.8.2',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 6,
  },
  Morty: {
    id: 'Morty',
    bookable: 'BOOKABLE',
    email: 'code.berlin_31333137303136343636@resource.calendar.google.com',
    displayName: 'Morty',
    factoryNumber: '4.8.1',
    category: 'MEETING_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 6,
  },
  BikiniBottom: {
    id: 'BikiniBottom',
    type: 'AREA',

    displayName: 'Bikini Bottom',

    factoryNumber: null,

    parentId: 'FourthFloor',
  },
  Galaxy: {
    id: 'Galaxy',
    type: 'AREA',

    displayName: 'Galaxy',

    factoryNumber: null,

    parentId: 'FourthFloor',
  },
  Kitchen: {
    id: 'Kitchen',
    type: 'AREA',

    displayName: 'Kitchen',

    factoryNumber: null,

    parentId: 'FourthFloor',
  },

  BikiniBottomLabel: {
    id: 'BikiniBottomLabel',
    parentId: 'BikiniBottom',

    type: 'LABEL',
  },
  CinemaLabel: {
    id: 'CinemaLabel',
    parentId: 'Cinema',

    type: 'LABEL',
  },
  HeavenLabel: {
    id: 'HeavenLabel',
    parentId: 'Heaven',

    type: 'LABEL',
  },
  GalaxyLabel: {
    id: 'GalaxyLabel',
    parentId: 'Galaxy',

    type: 'LABEL',
  },
  KitchenLabel: {
    id: 'KitchenLabel',
    parentId: 'Kitchen',

    type: 'LABEL',
  },
  Jungle: {
    id: 'Jungle',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_188b81q8a620qia5jnkdohp7bu0ug6g96ss32d1i6cq3ae0@resource.calendar.google.com',
    displayName: 'Jungle',
    factoryNumber: '4.6 / 4.7',
    category: 'LEARNING_UNITS',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 35,
  },
  Scissors: {
    id: 'Scissors',
    bookable: 'BOOKABLE',
    email: 'code.berlin_3934313230373536353639@resource.calendar.google.com',
    displayName: 'Scissors',
    factoryNumber: '4.11.4',
    category: 'LEARNING_UNITS',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 25,
  },
  Lizard: {
    id: 'Lizard',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_1885dv1guu8e4gsdmna2vusmqgqh2@resource.calendar.google.com',
    displayName: 'Lizard',
    factoryNumber: '4.11.2',
    category: 'LEARNING_UNITS',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 20,
  },
  Heaven: {
    id: 'Heaven',
    bookable: 'BOOKABLE',
    email: 'c_188cdiodrmjlkjgih2c5386g4mf2q@resource.calendar.google.com',
    displayName: 'Heaven',
    factoryNumber: '5.7',
    category: 'LEARNING_UNITS',

    parentId: 'FifthFloor',
    type: 'ROOM',

    capacity: 50,
  },
  Paper: {
    id: 'Paper',
    bookable: 'BOOKABLE',
    email: 'code.berlin_3635313131353437333332@resource.calendar.google.com',
    displayName: 'Paper',
    factoryNumber: '4.11.7',
    category: 'LEARNING_UNITS',

    parentId: 'FourthFloor',
    type: 'ROOM',

    capacity: 25,
  },
  Rock: {
    id: 'Rock',
    bookable: 'BOOKABLE',
    email: 'c_1886i0393ltc8gqgmach00hf1odhg@resource.calendar.google.com',
    displayName: 'Rock',
    factoryNumber: '4.11.6',
    category: 'LEARNING_UNITS',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 25,
  },
  Space: {
    id: 'Space',
    bookable: 'UNBOOKABLE',

    displayName: 'Space',
    factoryNumber: '4.2.1',
    category: 'SILENT_SPACE',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Spock: {
    id: 'Spock',
    bookable: 'APPLICATION_REQUIRED',
    // email: 'c_188a3b98kiajagpgl4of58hbhq7lk@resource.calendar.google.com',
    displayName: 'Spock',
    factoryNumber: '4.11.3',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Spongebob: {
    id: 'Spongebob',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Spongebob',
    factoryNumber: '4.1.6',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Patrick: {
    id: 'Patrick',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Patrick',
    factoryNumber: '4.1.5',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  MrKrabs: {
    id: 'MrKrabs',
    bookable: 'APPLICATION_REQUIRED',
    email: 'c_188b39t7a2lp0ivalb4cj6mfqq970@resource.calendar.google.com',

    displayName: 'Mr. Krabs',
    factoryNumber: '4.1.3',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Plankton: {
    id: 'Plankton',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Plankton',
    factoryNumber: '4.1.2',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Squidward: {
    id: 'Squidward',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Squidward',
    factoryNumber: '4.1.4',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Peace: {
    id: 'Peace',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Peace',
    factoryNumber: '4.8.5',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Roomy: {
    id: 'Roomy',
    bookable: 'APPLICATION_REQUIRED',

    displayName: 'Roomy',
    factoryNumber: '4.8.3',
    category: 'PROJECT_ROOM',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Void: {
    id: 'Void',
    bookable: 'APPLICATION_REQUIRED',
    // email: 'c_188d0sd2j8pnei5ai0f0ijl0p3bmg4gbcdnm8p9ec9in4r39do@resource.calendar.google.com',
    displayName: 'Void',
    factoryNumber: '4.3.2',
    category: 'WORKSHOP',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  EightBit: {
    id: 'EightBit',
    bookable: 'BOOKABLE',
    email:
      'code.berlin_188f0qjk7i3s8g6bj3dtntl59ppd46gb68r34c9l64p3achp60@resource.calendar.google.com',
    displayName: '8-Bit',
    factoryNumber: '4.11.8',
    category: 'STUDIO',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 2,
  },
  TeamRoom: {
    id: 'TeamRoom',
    bookable: 'TEAM_ONLY',

    displayName: 'Team Room',
    factoryNumber: '4.4',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Cognito: {
    id: 'Cognito',
    bookable: 'TEAM_ONLY',

    displayName: 'Cognito',
    factoryNumber: '4.4.2',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Nymeria: {
    id: 'Nymeria',
    bookable: 'TEAM_ONLY',

    displayName: 'Nymeria',
    factoryNumber: '4.4.3',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  AFF: {
    id: 'AFF',
    bookable: 'TEAM_ONLY',

    displayName: 'AFF',
    factoryNumber: '4.4.4',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Otterspace: {
    id: 'Otterspace',
    bookable: 'TEAM_ONLY',

    displayName: 'Otterspace',
    factoryNumber: '4.4.5',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  SixMinutes: {
    id: 'SixMinutes',
    bookable: 'TEAM_ONLY',

    displayName: '6 Min',
    factoryNumber: '4.4.1',
    category: 'TEAM_HQ',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  Kick: {
    id: 'Kick',
    bookable: 'BOOKABLE',
    email: 'c_1887gbat61a14jbcjg0cv85i41t9s@resource.calendar.google.com',
    displayName: 'Kick',
    factoryNumber: null,
    category: 'OFFICE_BOOTH',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 1,
  },
  Clap: {
    id: 'Clap',
    bookable: 'BOOKABLE',
    email: 'c_1886mt36arccmg6gktcllmauqn0ro@resource.calendar.google.com',
    displayName: 'Clap',
    factoryNumber: null,
    category: 'OFFICE_BOOTH',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 1,
  },
  Hi: {
    id: 'Hi',
    bookable: 'BOOKABLE',
    email: 'c_1881v5urdsafchk6n2mm25r7r0nji@resource.calendar.google.com',
    displayName: 'Hi',
    factoryNumber: null,
    category: 'OFFICE_BOOTH',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 1,
  },
  Hat: {
    id: 'Hat',
    bookable: 'BOOKABLE',
    email: 'c_188803ttv3sgkjdtg78o39nkideck@resource.calendar.google.com',
    displayName: 'Hat',
    factoryNumber: null,
    category: 'OFFICE_BOOTH',

    parentId: 'FourthFloor',
    type: 'ROOM',
    capacity: 1,
  },
  FourthFloorStairs: {
    id: 'FourthFloorStairs',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorStairs2: {
    id: 'FourthFloorStairs2',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorStairs3: {
    id: 'FourthFloorStairs3',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorStairs4: {
    id: 'FourthFloorStairs4',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorStairs: {
    id: 'FifthFloorStairs',
    parentId: 'FifthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorStairs2: {
    id: 'FifthFloorStairs2',
    parentId: 'FifthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorStairs3: {
    id: 'FifthFloorStairs3',
    parentId: 'FifthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorElevator: {
    id: 'FourthFloorElevator',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorElevator: {
    id: 'FifthFloorElevator',
    parentId: 'FifthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorEntrance: {
    id: 'FourthFloorEntrance',
    parentId: 'FourthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorEntrance: {
    id: 'FifthFloorEntrance',
    parentId: 'FifthFloor',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorRestrooms1Label: {
    id: 'FourthFloorRestrooms1Label',
    parentId: 'FourthFloorRestrooms1',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorRestrooms2Label: {
    id: 'FourthFloorRestrooms2Label',
    parentId: 'FourthFloorRestrooms2',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorRestrooms1Label: {
    id: 'FifthFloorRestrooms1Label',
    parentId: 'FifthFloorRestrooms1',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorRestrooms2Label: {
    id: 'FifthFloorRestrooms2Label',
    parentId: 'FifthFloorRestrooms2',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FifthFloorRestrooms3Label: {
    id: 'FifthFloorRestrooms3Label',
    parentId: 'FifthFloorRestrooms2',
    type: 'ICON',
    category: 'NAVIGATION',
  },
  FourthFloorRestrooms1: {
    id: 'FourthFloorRestrooms1',
    bookable: 'UNBOOKABLE',

    displayName: 'Restrooms',
    factoryNumber: null,
    category: 'RESTROOMS',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  FourthFloorRestrooms2: {
    id: 'FourthFloorRestrooms2',
    bookable: 'UNBOOKABLE',

    displayName: 'Restrooms',
    factoryNumber: null,
    category: 'RESTROOMS',

    parentId: 'FourthFloor',
    type: 'ROOM',
  },
  FifthFloorRestrooms1: {
    id: 'FifthFloorRestrooms1',
    bookable: 'UNBOOKABLE',

    displayName: 'Restrooms',
    factoryNumber: null,
    category: 'RESTROOMS',

    parentId: 'FifthFloor',
    type: 'ROOM',
  },
  FifthFloorRestrooms2: {
    id: 'FifthFloorRestrooms2',
    bookable: 'UNBOOKABLE',

    displayName: 'Restrooms',
    factoryNumber: null,
    category: 'RESTROOMS',

    parentId: 'FifthFloor',
    type: 'ROOM',
  },
  FifthFloorRestrooms3: {
    id: 'FifthFloorRestrooms3',
    bookable: 'UNBOOKABLE',

    displayName: 'Restrooms',
    factoryNumber: null,
    category: 'RESTROOMS',

    parentId: 'FifthFloor',
    type: 'ROOM',
  },
  JungleLabel: {
    id: 'JungleLabel',
    type: 'LABEL',

    parentId: 'Jungle',
  },
  SpongebobLabel: {
    id: 'SpongebobLabel',
    type: 'LABEL',

    parentId: 'Spongebob',
  },
  PatrickLabel: {
    id: 'PatrickLabel',
    type: 'LABEL',

    parentId: 'Patrick',
  },
  SquidwardLabel: {
    id: 'SquidwardLabel',
    type: 'LABEL',

    parentId: 'Squidward',
  },
  MrKrabsLabel: {
    id: 'MrKrabsLabel',
    type: 'LABEL',

    parentId: 'MrKrabs',
  },
  PlanktonLabel: {
    id: 'PlanktonLabel',
    type: 'LABEL',

    parentId: 'Plankton',
  },
  RoomyLabel: {
    id: 'RoomyLabel',
    type: 'LABEL',

    parentId: 'Roomy',
  },
  RickLabel: {
    id: 'RickLabel',
    type: 'LABEL',

    parentId: 'Rick',
  },
  MortyLabel: {
    id: 'MortyLabel',
    type: 'LABEL',

    parentId: 'Morty',
  },
  PeaceLabel: {
    id: 'PeaceLabel',
    type: 'LABEL',

    parentId: 'Peace',
  },
  SpockLabel: {
    id: 'SpockLabel',
    type: 'LABEL',

    parentId: 'Spock',
  },
  PaperLabel: {
    id: 'PaperLabel',
    type: 'LABEL',

    parentId: 'Paper',
  },
  ScissorsLabel: {
    id: 'ScissorsLabel',
    type: 'LABEL',

    parentId: 'Scissors',
  },
  RockLabel: {
    id: 'RockLabel',
    type: 'LABEL',

    parentId: 'Rock',
  },
  LizardLabel: {
    id: 'LizardLabel',
    type: 'LABEL',

    parentId: 'Lizard',
  },
  AFFLabel: {
    id: 'AFFLabel',
    type: 'LABEL',

    parentId: 'AFF',
  },
  SixMinutesLabel: {
    id: 'SixMinutesLabel',
    type: 'LABEL',

    parentId: 'SixMinutes',
  },
  TeamRoomLabel: {
    id: 'TeamRoomLabel',
    type: 'LABEL',

    parentId: 'TeamRoom',
  },
  CognitoLabel: {
    id: 'CognitoLabel',
    type: 'LABEL',

    parentId: 'Cognito',
  },
  EightBitLabel: {
    id: 'EightBitLabel',
    type: 'LABEL',

    parentId: 'EightBit',
  },
  EchoLabel: {
    id: 'EchoLabel',
    type: 'LABEL',

    parentId: 'Echo',
  },
  WarpLabel: {
    id: 'WarpLabel',
    type: 'LABEL',

    parentId: 'Warp',
  },
  ZuseLabel: {
    id: 'ZuseLabel',
    type: 'LABEL',

    parentId: 'Zuse',
  },
  AdaLabel: {
    id: 'AdaLabel',
    type: 'LABEL',

    parentId: 'Ada',
  },
  SilentSpaceLabel: {
    id: 'SilentSpaceLabel',
    type: 'LABEL',

    parentId: 'Space',
  },
  HiLabel: {
    id: 'HiLabel',
    type: 'LABEL',

    parentId: 'Hi',
  },
  HatLabel: {
    id: 'HatLabel',
    type: 'LABEL',

    parentId: 'Hat',
  },
  KickLabel: {
    id: 'KickLabel',
    type: 'LABEL',

    parentId: 'Kick',
  },
  ClapLabel: {
    id: 'ClapLabel',
    type: 'LABEL',

    parentId: 'Clap',
  },
  NymeriaLabel: {
    id: 'NymeriaLabel',
    type: 'LABEL',

    parentId: 'Nymeria',
  },
  OuterspaceLabel: {
    id: 'OuterspaceLabel',
    type: 'LABEL',

    parentId: 'Otterspace',
  },
  R2Label: {
    id: 'R2Label',
    type: 'LABEL',

    parentId: 'R2',
  },
  D2Label: {
    id: 'D2Label',
    type: 'LABEL',

    parentId: 'D2',
  },
  VoidLabel: {
    id: 'VoidLabel',
    type: 'LABEL',

    parentId: 'Void',
  },
  FourthFloorLabel: {
    id: 'FourthFloorLabel',
    type: 'LABEL',

    parentId: 'FourthFloor',
  },
  FifthFloorLabel: {
    id: 'FifthFloorLabel',
    type: 'LABEL',

    parentId: 'FifthFloor',
  },
}; // satisfies Record<AssetId, MapEntity>;

export const RoomCategoryData = {
  PROJECT_ROOM: {
    mapModeColor: '#FAFFBB',
    bookingModeColor: '#D9D9D9',
    displayName: 'Project room',
    showInLegend: true,
  },
  OFFICE_BOOTH: {
    mapModeColor: '#f2b01d',
    bookingModeColor: '#D9D9D9',
    displayName: 'Office booth',
    showInLegend: true,

    labelBookingModeColor: '#222',
  },
  TEAM_HQ: {
    mapModeColor: '#BEFBCF',
    bookingModeColor: '#D9D9D9',
    displayName: 'Team HQ',
    showInLegend: true,
  },
  MEETING_ROOM: {
    mapModeColor: '#D9D9D9',
    bookingModeColor: '#D9D9D9',
    displayName: 'Meeting room',
    showInLegend: true,
  },
  LEARNING_UNITS: {
    mapModeColor: '#988C8B',
    bookingModeColor: '#D9D9D9',
    displayName: 'For learning units',
    showInLegend: true,
  },
  STUDIO: {
    mapModeColor: '#F5BFF8',
    bookingModeColor: '#D9D9D9',
    displayName: 'Music studio',
    showInLegend: true,
  },
  WORKSHOP: {
    mapModeColor: '#7BD3E5',
    bookingModeColor: '#D9D9D9',
    displayName: 'Workshop',
    showInLegend: true,
  },
  SILENT_SPACE: {
    mapModeColor: 'transparent',
    bookingModeColor: 'transparent',
    displayName: 'Silent space',
    showInLegend: false,

    labelBookingModeColor: '#222',
  },
  WORKSPACES: {
    mapModeColor: 'transparent',
    bookingModeColor: 'transparent',
    displayName: 'Workspace',
    showInLegend: false,
  },
  FLOOR: {
    mapModeColor: 'white',
    bookingModeColor: 'white',
    displayName: 'Floor area',
    showInLegend: false,
  },
  RESTROOMS: {
    mapModeColor: '#FEF8F8',
    bookingModeColor: '#D9D9D9',
    displayName: 'Restrooms',
    showInLegend: false,
  },
  FACTORY_INACCESSIBLE: {
    mapModeColor: '#D9D9D9',
    bookingModeColor: '#D9D9D9',
    displayName: 'Not accessible to CODE members',
    showInLegend: false,
  },
} as const;

export const RoomBookableData = {
  BOOKABLE: {
    color: '#2CF261',
    displayName: 'Bookable',
    showInLegend: true,
  },
  BOOKED_FOR_ACADEMIC_EVENT: {
    color: '#4285f4',
    displayName: 'Booked for academic event',
    showInLegend: false,
  },
  UNBOOKABLE: {
    color: '#7c7c7d',
    displayName: 'Not bookable',
    showInLegend: false,
  },
  UNAVAILABLE: {
    color: '#FF6961',
    displayName: 'Booked right now',
    showInLegend: true,
  },
  APPLICATION_REQUIRED: {
    color: '#FAFFBB',
    displayName: 'Application required',
    showInLegend: false,
  },
  TEAM_ONLY: {
    color: '#BEFBCF',
    displayName: 'Team only',
    showInLegend: false,
  },
  BOOKED_BY_SELF: {
    color: '#ce49fa',
    displayName: 'You have this room',
    showInLegend: true,
  },
} as const;

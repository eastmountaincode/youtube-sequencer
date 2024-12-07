export enum PadCommand {
    PLAY = 'PLAY',
    PAUSE = 'PAUSE',
    ARROW_LEFT = 'ARROW_LEFT',
    ARROW_RIGHT = 'ARROW_RIGHT',
    ONE = '1',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    VOLUME = 'VOLUME',
    PLAYER_MUTE = 'PLAYER_MUTE',
    PLAYER_UNMUTE = 'PLAYER_UNMUTE',
    EMPTY = 'EMPTY'
}

export interface Pattern {
    id: string;
    name: string;
    description: string;
    s3_url: string;
    creator_id: string;
    created_at: string;
    likes_count: number;
    liked_by_user: boolean;
  }




/**
 * Interface for statistic game replay
 * Each object represents one event that happened after the game was started
 */
interface IReplayLogEntry {
    type: string;
}

interface ILogTilePlaced extends IReplayLogEntry {
    type: "tilePlaced";
    player: IPlayer;
    x: number;
    y: number;
    turnNo: number; // Number of turn. Is incremented for each ILogTilePlaced
}

interface ILogJoined extends IReplayLogEntry {
    type: "joined";
    player: IPlayer;
    // Always spectators! Anyone else joined before the game
}

interface ILogLeft extends IReplayLogEntry {
    type: "left";
    player: IPlayer;
    // If the player was not a spectator, all tiles covered by this player are to be removed
}

interface ILogWinner extends IReplayLogEntry {
    type: "winner";
    player: IPlayer;
}

interface ILogChatMessage extends IReplayLogEntry {
    type: "chat";
    player: IPlayer;
    message: string;
}

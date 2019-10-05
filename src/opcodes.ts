// From client to server
export enum CLIENT_OPCODES {
}
// From server -> client
export enum OPCODES {
  /**
   * Sending ID for new user to identify him
   */
  identification_s = 0,
  /**
   * Sends player ids. Called for new player with
   * all existing and broadcasted for all on new player conneciton
   */
  addPlayer_s = 1,
  /**
   * For new connection sends coordinate of other users
   * Broadcast for others coord of the player
   */
  location_s = 2,
  action_s = 3,
  removePlayer_s = 4,
  
  location_c = 100,
  action_c = 101
}

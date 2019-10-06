import { OPCODES } from "../opcodes";
import { OpCodeHandler, Client } from "../client";

export const handlers = new Map<OPCODES, OpCodeHandler>();

handlers.set(OPCODES.location_c, (client: Client, data: Buffer) => {
  console.log('OPCODES.location_c handler');
});
handlers.set(OPCODES.action_c, (client: Client, data: Buffer) => {
  console.log('OPCODES.action_c handler');
});
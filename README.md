# LD45-server

# Protocol info

There might be different types of message  
Currently in first byte we're sending type

| Byte | Type             |
| ---- | ----             |
| 00   | identification_s |
| 01   | addPlayer_s      |
| 02   | location_s       |
| 03   | action_s         |
| 04   | removePlayer_s   |
| 100  | location_c       |
| 101  | action_c         |

### Identification (server)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |

**Server should return Client ID immediately after client connects to it.**

### Location (server)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |
| 2           | X coordinate    |
| 2           | Y coordinate    |
| ...         | ...             |

*Data might go in same order as needed and needs to be parsed until end of message.*

### Action (server)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |
| 2           | X coordinate    |
| 2           | Y coordinate    |
| 1           | Action          |
| ...         | ...             |

*Data might go in same order as needed and needs to be parsed until end of message.*

### RemovePlayer (server)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |
| ...         | ...             |

*Data might go in same order as needed and needs to be parsed until end of message.*


### Location (client)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | X coordinate    |
| 2           | Y coordinate    |

### Action (client)

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | X coordinate    |
| 2           | Y coordinate    |
| 1           | Action          |

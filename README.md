# LD45-server

# Protocol info

There might be different types of message  
Currently in first byte we're sending type

| Byte | Type            |
| ---- | ----            |
| 00   | Nothing         |
| 01   | Location        |
| 02   | Action          |
| 03   | Identification  |
| 04   | Nothing         |
| 05   | Nothing         |

### Location

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |
| 2           | X coordinate    |
| 2           | Y coordinate    |
| ...         | ...             |

*Data might go in same order as needed and needs to be parsed until end of message.*

### Action

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |
| 2           | X coordinate    |
| 2           | Y coordinate    |
| 1           | Action          |
| ...         | ...             |

*Data might go in same order as needed and needs to be parsed until end of message.*

### Identification

After first **Type Byte** we are sending data in next structure:

| Byte amount | Data            |
| ----        | ----            |
| 2           | Client ID       |

**Probably server should return Client ID immediately after client connects to it.**


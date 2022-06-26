import Counter from "./Counter"
import Grid from "./Grid"
import CardLink from "./CardLink"
import TileCalendar, { TileLog } from "./TileCalendar"
import headerTitles from "./HeaderTitle"

const map = {
  counter: Counter,
  grid: Grid,
  "card-link": CardLink,
  "tile-calendar": TileCalendar,
  log: TileLog,
  ...headerTitles,
}

export default map

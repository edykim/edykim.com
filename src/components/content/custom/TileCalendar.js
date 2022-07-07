import { addYears, startOfWeek, format, parse, isBefore } from "date-fns"
import eachDayOfInterval from "date-fns/eachDayOfInterval"
import React, { useContext, useReducer, useMemo, useEffect } from "react"
import styled from "styled-components"
import { layouts } from "~/constraint"

const CalendarContext = React.createContext()

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      return { ...state, tiles: [...state.tiles, action.payload] }
    }
    case "remove": {
      const p = action.payload
      return {
        ...state,
        tiles: state.tiles.filter(t => t.date !== p.date && t.note !== p.note),
      }
    }
    default: {
      throw new Error()
    }
  }
}

const ContainerWrapper = styled.div`
  max-width: ${layouts.content} !important;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  @media screen and (max-width: 810px) {
    justify-content: ${props => (props.continued ? "flex-end" : "flex-start")};
  }
`

const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 3px;
  grid-auto-flow: column;
  position: relative;
  .tile {
    border-radius: 3px;
    width: 12px;
    height: 12px;
    background-color: #f3f3f3;
    &.active {
      background-color: #4caf50;
    }
    &.none {
      background-color: transparent !important;
    }
    .yr,
    .month {
      color: #aaaaaa;
      font-size: 0.7rem;
      position: absolute;
      margin: 0;
      padding: 0;
    }
    .yr {
      top: 0;
    }
    .month {
      bottom: 0;
    }
  }
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
`

const Tile = styled.div`
  ${props => props.color && `background-color: ${props.color} !important`}
`

const LogList = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  max-width: ${layouts.content} !important;
  font-size: 0.8rem;
  .row {
    display: grid;
    grid-template-columns: 20% auto;
    margin-bottom: 0.5rem;
  }
  .date {
    color: #aaa;
    font-size: 0.7rem;
  }
`

const TileCalendar = props => {
  const {
    "start-date": _startDate,
    "end-date": _endDate,
    colors: _colors,
    children,
  } = props
  const hideEmpty = props.hasOwnProperty("hide-empty")

  const startDate = _startDate
    ? parse(_startDate, "yyyy-MM-dd", new Date())
    : addYears(new Date(), -1)
  const endDate = _endDate
    ? parse(_endDate, "yyyy-MM-dd", new Date())
    : new Date()

  const colors = _colors ? _colors.split(",") : null

  const result = eachDayOfInterval({
    start: startOfWeek(startDate),
    end: endDate,
  })
  const [state, dispatch] = useReducer(reducer, {
    tiles: [],
    today: new Date(),
  })
  const value = useMemo(
    () => ({
      tiles: state,
      addTile: data => {
        dispatch({ type: "add", payload: data })
      },
      removeTile: data => {
        dispatch({ type: "remove", payload: data })
      },
    }),
    [state]
  )
  let year = 0
  let month = 0
  return (
    <CalendarContext.Provider value={value}>
      <>{children}</>
      <ContainerWrapper continued={!_startDate && !_endDate}>
        <Container>
          {result.map((r, i) => {
            const date = format(r, "yyyy-MM-dd")
            const yr = format(r, "yyyy")
            const mt = format(r, "MMM")
            const day = format(r, "dd")
            const found = state.tiles.find(v => v.date === date)

            return (
              <Tile
                key={date}
                className={`tile${
                  found
                    ? " active"
                    : startDate && isBefore(r, startDate)
                    ? " none"
                    : ""
                }`}
                color={found && colors ? colors[found.color] : null}
              >
                {day === "01" ? (
                  <>
                    {year !== yr && (year = yr) ? (
                      <span className="yr">{yr}</span>
                    ) : null}
                    {month !== yr && (month = mt) ? (
                      <span className="month">{mt}</span>
                    ) : null}
                  </>
                ) : null}
              </Tile>
            )
          })}
        </Container>
      </ContainerWrapper>
      <LogList>
        {state.tiles
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((tile, i) => {
            if (hideEmpty && !tile.note) return null
            return (
              <div className="row" key={`${tile.date}-${i}`}>
                <div className="date">{`${format(
                  parse(tile.date, "yyyy-MM-dd", new Date()),
                  "MMMM d, yyyy"
                )}`}</div>{" "}
                <div className="note">
                  {tile.note}
                </div>
              </div>
            )
          })}
      </LogList>
    </CalendarContext.Provider>
  )
}

export default TileCalendar

export const TileLog = ({ date, color, note, children }) => {
  const { addTile, removeTile } = useContext(CalendarContext)
  useEffect(() => {
    addTile({ date, color, note: children ?? note })
    return () => {
      removeTile({ date, color, note: children ?? note })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

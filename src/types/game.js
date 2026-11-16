export const Game = Object.freeze({
  Html: 'html',
  JavaScript: 'js',
  Sql: 'sql',
  Node: 'node',
})

export const GameUrl = Object.freeze({
  [Game.Html]: 'https://learning-html.sergiolema.dev',
  [Game.JavaScript]: 'https://learning-js.sergiolema.dev',
  [Game.Sql]: 'https://learning-sql.sergiolema.dev',
  [Game.Node]: 'https://learning-node.sergiolema.dev',
})

export const CurrentGame = Game.Sql

import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import i18n from '../../i18n/index.js'
import { renderWithUser } from '../../test/render.js'
import { CurrentGame, Game, GameUrl } from '../../types/game.js'
import { Language } from '../../types/language.js'
import { MoreGames } from './MoreGames.jsx'

const names = {
  [Game.Html]: 'Brick by Brick',
  [Game.JavaScript]: 'Brick Shop',
  [Game.Sql]: 'Brick by Brick SQL',
  [Game.Node]: 'Brick Shop API',
}

const openMenu = async () => {
  const rendered = renderWithUser(
    <>
      <MoreGames />
      <button type="button">Outside</button>
    </>,
  )
  await rendered.user.click(screen.getByRole('button', { expanded: false }))
  return rendered
}

describe('MoreGames', () => {
  describe('button', () => {
    it('starts closed', () => {
      renderWithUser(<MoreGames />)

      expect(screen.getByRole('button', { name: 'More games' })).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('toggles the list', async () => {
      const { user } = await openMenu()
      const button = screen.getByRole('button', { name: 'More games' })

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('list', { name: 'More games' })).toBeInTheDocument()

      await user.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('list', () => {
    it('links the other games in the same tab, without the current one', async () => {
      await openMenu()

      const links = within(screen.getByRole('list')).getAllByRole('link')
      const others = Object.values(Game).filter((game) => game !== CurrentGame)
      expect(links).toHaveLength(others.length)
      others.forEach((game, index) => {
        expect(links[index]).toHaveAccessibleName(expect.stringContaining(names[game]))
        expect(links[index]).toHaveAttribute('href', GameUrl[game])
        expect(links[index]).not.toHaveAttribute('target')
      })
      expect(links.map((link) => link.getAttribute('href'))).not.toContain(GameUrl[CurrentGame])
    })

    it('translates the label and the games', async () => {
      await i18n.changeLanguage(Language.French)
      await openMenu()

      expect(screen.getByRole('button', { name: 'Plus de jeux' })).toBeInTheDocument()
      expect(screen.getByRole('list', { name: 'Plus de jeux' })).toHaveTextContent(
        i18n.t(`moreGames.games.${Object.values(Game).find((game) => game !== CurrentGame)}.tagline`),
      )
    })
  })

  describe('closing', () => {
    it('closes on Escape and gives the focus back to the button', async () => {
      const { user } = await openMenu()

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'More games' })).toHaveFocus()
    })

    it('closes on a click outside', async () => {
      const { user } = await openMenu()

      await user.click(screen.getByText('Outside'))

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('closes when the focus leaves it', async () => {
      const { user } = await openMenu()

      act(() => screen.getAllByRole('link').at(-1).focus())
      await user.tab()

      expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus()
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })
})

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurrentGame, Game, GameUrl } from '../../types/game.js'
import { ChevronIcon } from '../icons/ChevronIcon.jsx'
import './MoreGames.scss'

export function MoreGames() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const games = Object.values(Game).filter((game) => game !== CurrentGame)

  const closeOnFocusLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }

  const renderGame = (game) => (
    <li key={game}>
      <a className="more-games-link" href={GameUrl[game]}>
        <span className={`more-games-badge more-games-badge-${game}`} aria-hidden="true">
          {t(`moreGames.games.${game}.badge`)}
        </span>
        <span className="more-games-text">
          <span className="more-games-name">{t(`moreGames.games.${game}.name`)}</span>
          <span className="more-games-tagline">{t(`moreGames.games.${game}.tagline`)}</span>
        </span>
      </a>
    </li>
  )

  return (
    <div className="more-games" ref={rootRef} onBlur={closeOnFocusLeave}>
      <button
        ref={buttonRef}
        type="button"
        className="more-games-button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {t('moreGames.label')}
        <ChevronIcon className="more-games-chevron" />
      </button>
      {open && (
        <ul id={listId} className="more-games-list" aria-label={t('moreGames.label')}>
          {games.map(renderGame)}
        </ul>
      )}
    </div>
  )
}

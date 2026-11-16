import { useTranslation } from 'react-i18next'
import { BrickIcon } from '../components/icons/BrickIcon.jsx'
import { LanguageSelect } from '../components/language-select/LanguageSelect.jsx'
import { MoreGames } from '../components/more-games/MoreGames.jsx'
import { Footer } from './Footer.jsx'
import './PublicLayout.scss'

export function PublicLayout({ navigation, children }) {
  const { t } = useTranslation()

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <BrickIcon className="brand-icon" />
          {t('app.name')}
        </span>
        {navigation}
        <div className="topbar-actions">
          <MoreGames />
          <LanguageSelect />
        </div>
      </header>
      {children}
      <Footer />
    </div>
  )
}

import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { auth } from '../auth';
import { useTheme } from '../hooks/useTheme';
import { applyUser } from '../redux';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Brand from './Brand';

function Header() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.user.email);
  const { theme, toggle } = useTheme();

  const logout = async () => {
    try {
      await auth.signOut();
    } finally {
      dispatch(applyUser(null));
    }
  };

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Brand />
        <div className="topbar__actions">
          <span className="topbar__user" data-testid="email-field" title={ email }>
            {email}
          </span>
          <button
            type="button"
            className="btn btn--icon"
            onClick={ toggle }
            aria-label={ theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro' }
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button type="button" className="btn btn--ghost" onClick={ logout }>
            <FiLogOut aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

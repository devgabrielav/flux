import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import validator from 'validator';
import { auth } from '../auth';
import Brand from '../components/Brand';
import PasswordField from '../components/PasswordField';
import Splash from '../components/Splash';
import { applyUser } from '../redux';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

type Mode = 'signin' | 'signup';

function Login() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.user);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'loading') return <Splash />;
  if (status === 'authenticated') return <Navigate to="/carteira" replace />;

  const isSignup = mode === 'signup';
  const valid = validator.isEmail(email) && password.length >= (isSignup ? 8 : 6);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const user = isSignup
        ? await auth.signUp(email.trim(), password)
        : await auth.signIn(email.trim(), password);
      if (user) {
        dispatch(applyUser(user));
      } else {
        setMode('signin');
        setNotice('Conta criada! Confirme seu e-mail e depois entre.');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <form className="card auth__card" onSubmit={ submit } noValidate>
        <Brand />
        <h1 className="auth__title">
          {isSignup ? 'Crie sua conta' : 'Bem-vindo de volta'}
        </h1>
        <p className="muted">Controle seus gastos em qualquer moeda.</p>

        <label className="field">
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            data-testid="email-input"
            autoComplete="email"
            value={ email }
            onChange={ (event) => setEmail(event.target.value) }
            placeholder="voce@email.com"
          />
        </label>
        <PasswordField
          value={ password }
          isSignup={ isSignup }
          onChange={ setPassword }
        />

        {error && <p className="alert" role="alert">{error}</p>}
        {notice && <p className="notice" role="status">{notice}</p>}

        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={ !valid || busy }
        >
          {isSignup ? 'Criar conta' : 'Entrar'}
        </button>
        <p className="auth__switch">
          {isSignup ? 'Já tem conta?' : 'Ainda não tem conta?'}
          {' '}
          <button
            type="button"
            className="link"
            onClick={ () => switchMode(isSignup ? 'signin' : 'signup') }
          >
            {isSignup ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
        {auth.mode === 'demo' && (
          <p className="demo-note">
            Modo demo: as contas ficam só neste navegador. Configure o Supabase
            para autenticação real (veja o README).
          </p>
        )}
      </form>
    </main>
  );
}

export default Login;

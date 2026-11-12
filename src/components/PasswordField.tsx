import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type Props = {
  value: string,
  isSignup: boolean,
  onChange: (value: string) => void,
};

function PasswordField({ value, isSignup, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="field">
      <span>Senha</span>
      <div className="field__password">
        <input
          type={ visible ? 'text' : 'password' }
          name="password"
          data-testid="password-input"
          autoComplete={ isSignup ? 'new-password' : 'current-password' }
          value={ value }
          onChange={ (event) => onChange(event.target.value) }
          placeholder={ isSignup ? 'Mínimo de 8 caracteres' : 'Sua senha' }
        />
        <button
          type="button"
          className="btn btn--icon"
          onClick={ () => setVisible(!visible) }
          aria-label={ visible ? 'Ocultar senha' : 'Mostrar senha' }
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
  );
}

export default PasswordField;

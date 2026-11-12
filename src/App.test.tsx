import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { mockRatesApi, renderApp } from './tests/helpers';

const EMAIL = 'teste@teste.com';
const PASSWORD = '12345678';

async function signUp(user: ReturnType<typeof renderApp>['user']) {
  await user.click(screen.getByRole('button', { name: 'Criar conta' }));
  await user.type(screen.getByPlaceholderText('voce@email.com'), EMAIL);
  await user.type(screen.getByTestId('password-input'), PASSWORD);
  await user.click(screen.getByRole('button', { name: 'Criar conta', description: '' }));
}

beforeEach(() => {
  mockRatesApi();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('Login', () => {
  it('mantém o botão desabilitado até o e-mail e a senha serem válidos', async () => {
    const { user } = renderApp(<App />);
    const button = await screen.findByRole('button', { name: 'Entrar' });
    expect(button).toBeDisabled();
    await user.type(screen.getByTestId('email-input'), 'invalido');
    await user.type(screen.getByTestId('password-input'), '123456');
    expect(button).toBeDisabled();
    await user.clear(screen.getByTestId('email-input'));
    await user.type(screen.getByTestId('email-input'), EMAIL);
    expect(button).toBeEnabled();
  });

  it('bloqueia rotas privadas para quem não está logado', async () => {
    renderApp(<App />, '/carteira');
    expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeInTheDocument();
  });

  it('cria conta, entra na carteira e rejeita senha errada depois de sair', async () => {
    const { user } = renderApp(<App />);
    await screen.findByRole('heading', { name: 'Bem-vindo de volta' });
    await signUp(user);
    expect(await screen.findByTestId('email-field')).toHaveTextContent(EMAIL);

    await user.click(screen.getByRole('button', { name: /sair/i }));
    await user.type(await screen.findByTestId('email-input'), EMAIL);
    await user.type(screen.getByTestId('password-input'), 'senha-errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.');
  });
});

describe('Carteira', () => {
  async function openWallet() {
    const utils = renderApp(<App />);
    await screen.findByRole('heading', { name: 'Bem-vindo de volta' });
    await signUp(utils.user);
    await screen.findByTestId('total-field');
    await waitFor(() => expect(utils.store.getState().wallet.ratesStatus).toBe('ready'));
    return utils;
  }

  async function addExpense(user: ReturnType<typeof renderApp>['user'], value: string, text: string) {
    await user.type(screen.getByTestId('value-input'), value);
    await user.type(screen.getByTestId('description-input'), text);
    await user.click(screen.getByRole('button', { name: 'Adicionar despesa' }));
  }

  it('adiciona despesas, converte o total e muda a moeda de exibição', async () => {
    const { user } = await openWallet();
    expect(screen.getByTestId('total-field')).toHaveTextContent('0,00');
    await addExpense(user, '10', 'Almoço');
    expect(await screen.findByText('Almoço')).toBeInTheDocument();
    expect(screen.getByTestId('total-field')).toHaveTextContent('R$ 50,00');

    await user.selectOptions(screen.getByTestId('header-currency-field'), 'EUR');
    expect(screen.getByTestId('total-field').textContent).toMatch(/€\s?8,33/);
  });

  it('valida o formulário', async () => {
    const { user } = await openWallet();
    await user.click(screen.getByRole('button', { name: 'Adicionar despesa' }));
    expect(screen.getByRole('alert')).toHaveTextContent('valor maior que zero');
  });

  it('edita e exclui uma despesa, sem repetir ids', async () => {
    const { user, store } = await openWallet();
    await addExpense(user, '10', 'Um');
    await screen.findByText('Um');
    await addExpense(user, '20', 'Dois');
    await screen.findByText('Dois');

    await user.click(screen.getByRole('button', { name: 'Excluir Um' }));
    await addExpense(user, '30', 'Três');
    await screen.findByText('Três');
    expect(store.getState().wallet.expenses.map(({ id }) => id)).toEqual([1, 2]);

    await user.click(screen.getByRole('button', { name: 'Editar Dois' }));
    const description = screen.getByTestId('description-input');
    expect(description).toHaveValue('Dois');
    await user.clear(description);
    await user.type(description, 'Dois editado');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    const row = (await screen.findByText('Dois editado')).closest('tr') as HTMLElement;
    expect(within(row).getByText('R$ 100,00')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TransactionForm } from '../TransactionForm';
import { transactionService } from '@/services/transaction.service';

vi.mock('@/services/transaction.service', () => ({
  transactionService: {
    create: vi.fn(),
    suggestCategory: vi.fn(),
  },
}));

const renderForm = () =>
  render(
    <BrowserRouter>
      <TransactionForm />
    </BrowserRouter>
  );

const selectOption = async (user: ReturnType<typeof userEvent.setup>, triggerName: RegExp, optionName: RegExp) => {
  await user.click(screen.getByRole('combobox', { name: triggerName }));
  await user.click(await screen.findByRole('option', { name: optionName }));
};

describe('TransactionForm category suggestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('auto-fills the category suggested from the description', async () => {
    vi.mocked(transactionService.suggestCategory).mockResolvedValue({
      category: 'Transportation',
      confidence: 0.9,
    });
    const user = userEvent.setup();
    renderForm();

    await selectOption(user, /type/i, /expense/i);
    await user.type(screen.getByLabelText(/description/i), 'Uber ride to the airport');
    await user.tab();

    await waitFor(() => {
      expect(transactionService.suggestCategory).toHaveBeenCalledWith(
        'EXPENSE',
        'Uber ride to the airport'
      );
    });
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent(
        'Transportation'
      );
    });
  });

  it('does not overwrite a category the user picked manually', async () => {
    vi.mocked(transactionService.suggestCategory).mockResolvedValue({
      category: 'Transportation',
      confidence: 0.9,
    });
    const user = userEvent.setup();
    renderForm();

    await selectOption(user, /type/i, /expense/i);
    await selectOption(user, /category/i, /^housing$/i);
    await user.type(screen.getByLabelText(/description/i), 'Uber ride to the airport');
    await user.tab();

    await waitFor(() => {
      expect(transactionService.suggestCategory).not.toHaveBeenCalled();
    });
    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent('Housing');
  });

  it('ignores a low-confidence suggestion (null category)', async () => {
    vi.mocked(transactionService.suggestCategory).mockResolvedValue({
      category: null,
      confidence: 0.2,
    });
    const user = userEvent.setup();
    renderForm();

    await selectOption(user, /type/i, /expense/i);
    await user.type(screen.getByLabelText(/description/i), 'Payment');
    await user.tab();

    await waitFor(() => {
      expect(transactionService.suggestCategory).toHaveBeenCalled();
    });
    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent('Food');
  });
});

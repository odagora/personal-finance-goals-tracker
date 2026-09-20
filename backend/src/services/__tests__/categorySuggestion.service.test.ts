import { TransactionType } from '../../types';

const systemOneMock = jest.fn();

jest.mock('@typesafe-ai/sdk', () => ({
  TypeSafeClient: jest.fn().mockImplementation(() => ({ systemOne: systemOneMock })),
  choice: jest.fn((instructions, criteria) => ({ type: 'choice', instructions, criteria })),
}));

describe('CategorySuggestionService', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    systemOneMock.mockReset();
    process.env = { ...ORIGINAL_ENV, TYPESAFE_API_KEY: 'test-key' };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns the suggested category when confidence is high', async () => {
    systemOneMock.mockResolvedValue({
      answers: { category: { choice: 'Transportation', confidence: 0.9 } },
    });

    const { default: CategorySuggestionService } = await import('../categorySuggestion.service');
    const result = await CategorySuggestionService.suggestCategory(
      TransactionType.EXPENSE,
      'Uber ride to the airport'
    );

    expect(result).toEqual({ category: 'Transportation', confidence: 0.9 });
    expect(systemOneMock).toHaveBeenCalledTimes(1);
  });

  it('withholds the suggestion when confidence is below the threshold', async () => {
    systemOneMock.mockResolvedValue({
      answers: { category: { choice: 'Shopping', confidence: 0.3 } },
    });

    const { default: CategorySuggestionService } = await import('../categorySuggestion.service');
    const result = await CategorySuggestionService.suggestCategory(
      TransactionType.EXPENSE,
      'Payment'
    );

    expect(result).toEqual({ category: null, confidence: 0.3 });
  });

  it('does not call the API for an empty description', async () => {
    const { default: CategorySuggestionService } = await import('../categorySuggestion.service');
    const result = await CategorySuggestionService.suggestCategory(TransactionType.EXPENSE, '   ');

    expect(result).toEqual({ category: null, confidence: 0 });
    expect(systemOneMock).not.toHaveBeenCalled();
  });

  it('fails closed when the API call throws', async () => {
    systemOneMock.mockRejectedValue(new Error('service unavailable'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { default: CategorySuggestionService } = await import('../categorySuggestion.service');
    const result = await CategorySuggestionService.suggestCategory(
      TransactionType.INCOME,
      'Monthly paycheck'
    );

    expect(result).toEqual({ category: null, confidence: 0 });
  });

  it('does not call the API when no API key is configured', async () => {
    process.env = { ...ORIGINAL_ENV, TYPESAFE_API_KEY: undefined };

    const { default: CategorySuggestionService } = await import('../categorySuggestion.service');
    const result = await CategorySuggestionService.suggestCategory(
      TransactionType.EXPENSE,
      'Groceries at the market'
    );

    expect(result).toEqual({ category: null, confidence: 0 });
    expect(systemOneMock).not.toHaveBeenCalled();
  });
});

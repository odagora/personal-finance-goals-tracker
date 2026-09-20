import { choice, TypeSafeClient } from '@typesafe-ai/sdk';
import config from '../config';
import { CategorySuggestion, TRANSACTION_CATEGORIES, TransactionType } from '../types';

// Below this, probabilities are too spread out across categories to auto-apply a suggestion.
const CONFIDENCE_THRESHOLD = 0.5;

const NO_SUGGESTION: CategorySuggestion = { category: null, confidence: 0 };

class CategorySuggestionService {
  private client = config.typesafe.apiKey ? new TypeSafeClient() : null;

  // Suggests a category for a transaction from its free-text description.
  // Never throws: a suggestion is a convenience, not a requirement for creating a transaction.
  async suggestCategory(type: TransactionType, description: string): Promise<CategorySuggestion> {
    const trimmedDescription = description.trim();
    if (!trimmedDescription || !this.client) {
      return NO_SUGGESTION;
    }

    const categories = TRANSACTION_CATEGORIES[type];
    const criteria = Object.fromEntries(categories.map((category) => [category, null]));

    try {
      const response = await this.client.systemOne({
        state: { description: trimmedDescription, transactionType: type },
        questions: {
          category: choice(
            'Which category best matches this transaction description?',
            criteria
          ),
        },
      });

      const { choice: suggestedCategory, confidence } = response.answers.category;
      if (confidence < CONFIDENCE_THRESHOLD) {
        return { category: null, confidence };
      }

      return { category: suggestedCategory as (typeof categories)[number], confidence };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Category suggestion failed:', error);
      return NO_SUGGESTION;
    }
  }
}

export default new CategorySuggestionService();

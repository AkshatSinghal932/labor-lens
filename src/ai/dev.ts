import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-report-category.ts';
import '@/ai/flows/prioritize-reports-by-severity.ts';
import '@/ai/flows/summarize-report-for-review.ts';
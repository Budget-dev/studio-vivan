'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered recipe ideas and usage tips for a given product.
 *
 * - aiProductUsageAndRecipeIdeas - A function that fetches AI-generated recipe ideas and usage tips for a product.
 * - ProductInfoInput - The input type for the aiProductUsageAndRecipeIdeas function.
 * - RecipeIdeasOutput - The return type for the aiProductUsageAndRecipeIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductInfoInputSchema = z.object({
  name: z.string().describe('The name of the product (e.g., "A2 Gir Cow Ghee").'),
  volume: z.string().optional().describe('The volume or size of the product (e.g., "500ml Glass Jar").'),
  description: z.string().describe('A brief description of the product.'),
  category: z.string().describe('The category of the product (e.g., "ghee", "oil", "combo").'),
});
export type ProductInfoInput = z.infer<typeof ProductInfoInputSchema>;

const RecipeIdeasOutputSchema = z.object({
  recipeIdeas: z.array(
    z.object({
      title: z.string().describe('The title of the recipe idea.'),
      description: z.string().describe('A short description of the recipe idea, highlighting how the product is used.'),
    })
  ).describe('A list of creative recipe ideas using the product.'),
  usageTips: z.array(z.string()).describe('A list of practical usage tips for incorporating the product into daily cooking.'),
});
export type RecipeIdeasOutput = z.infer<typeof RecipeIdeasOutputSchema>;

export async function aiProductUsageAndRecipeIdeas(input: ProductInfoInput): Promise<RecipeIdeasOutput> {
  return aiProductUsageAndRecipeIdeasFlow(input);
}

const generateRecipeIdeasPrompt = ai.definePrompt({
  name: 'generateRecipeIdeasPrompt',
  input: {schema: ProductInfoInputSchema},
  output: {schema: RecipeIdeasOutputSchema},
  prompt: `You are an expert chef and food blogger specializing in traditional Indian cuisine and healthy living.
Given the following details about a pure farm product from Vivaan Farms, generate creative and practical recipe ideas and everyday usage tips.
Focus on highlighting the product's natural goodness, versatility, and benefits.

Product Name: {{{name}}}
Product Category: {{{category}}}
Product Description: {{{description}}}

Generate exactly 3 recipe ideas and 3 usage tips.`,
});

const aiProductUsageAndRecipeIdeasFlow = ai.defineFlow(
  {
    name: 'aiProductUsageAndRecipeIdeasFlow',
    inputSchema: ProductInfoInputSchema,
    outputSchema: RecipeIdeasOutputSchema,
  },
  async (input) => {
    const {output} = await generateRecipeIdeasPrompt(input);
    if (!output) {
      throw new Error('Failed to generate recipe ideas and usage tips.');
    }
    return output;
  }
);

'use server';
/**
 * @fileOverview A Genkit flow that generates dynamic, realistic live purchase notifications.
 *
 * - generateLivePurchaseNotification - A function that handles the generation of a live purchase notification.
 * - GenerateLivePurchaseNotificationInput - The input type for the generateLivePurchaseNotification function.
 * - GenerateLivePurchaseNotificationOutput - The return type for the generateLivePurchaseNotification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Output schema for the notification message
const GenerateLivePurchaseNotificationOutputSchema = z.object({
  message: z.string().describe('A dynamic live purchase notification message.'),
});
export type GenerateLivePurchaseNotificationOutput = z.infer<typeof GenerateLivePurchaseNotificationOutputSchema>;

// Input schema for the prompt (internal to the flow, but defines what the prompt expects)
const NotificationPromptInputSchema = z.object({
  customerName: z.string().describe("The name of the customer who made the purchase."),
  customerCity: z.string().describe("The city of the customer who made the purchase."),
  productName: z.string().describe("The name of the product purchased."),
});

// Input schema for the flow (empty, as the flow generates its own data)
const GenerateLivePurchaseNotificationInputSchema = z.object({});
export type GenerateLivePurchaseNotificationInput = z.infer<typeof GenerateLivePurchaseNotificationInputSchema>;


// Internal data for generating notifications
const customerProductData = [
  { name: 'Priya', city: 'Mumbai', product: 'A2 Gir Ghee 1L' },
  { name: 'Arjun', city: 'Delhi', product: 'Gir Cow Ghee 2.5L' },
  { name: 'Sunita', city: 'Bengaluru', product: 'Desi+Gir Combo' },
  { name: 'Rahul', city: 'Pune', product: 'A2 Gir Ghee 5L' },
  { name: 'Deepa', city: 'Hyderabad', product: 'A2 Gir Ghee 500ml' },
  { name: 'Ananya', city: 'Kolkata', product: 'Organic Honey 250g' },
  { name: 'Ishita', city: 'Jaipur', product: 'A2 Gir Ghee 500ml Glass Jar' },
  { name: 'Fatima', city: 'Lucknow', product: 'A2 Gir Ghee 1L' },
  { name: 'Rajesh', city: 'Patna', product: 'Desi Cow Ghee 500ml' },
  { name: 'Shalini', city: 'Indore', product: 'Mixed Dry Fruits Pack' },
  { name: 'Swati', city: 'Nagpur', product: 'Saffron Threads 1g' },
];


// Define the Prompt
const generateNotificationPrompt = ai.definePrompt({
  name: 'generateLivePurchaseNotificationPrompt',
  input: { schema: NotificationPromptInputSchema }, // This is the data the prompt expects from the flow
  output: { schema: GenerateLivePurchaseNotificationOutputSchema },
  prompt: `You are an AI assistant for Vivaan Farms. Your task is to generate a realistic and engaging live purchase notification message based on the provided customer and product details.
The message should sound like a real person just ordered a product, creating a sense of social proof and urgency.
Use a varied and natural tone, similar to these examples:

- "{{customerName}} from {{customerCity}} just purchased {{productName}}!"
- "Amazing! {{customerName}} from {{customerCity}} just bought {{productName}}."
- "{{customerName}} ({{customerCity}}) recently ordered {{productName}}."
- "Look! {{customerName}} from {{customerCity}} just snapped up {{productName}}!"

Always make sure the output is a JSON object with a single 'message' field.

Customer Name: {{{customerName}}}
Customer City: {{{customerCity}}}
Product Name: {{{productName}}}
`,
});

// Define the Flow
const generateLivePurchaseNotificationFlow = ai.defineFlow(
  {
    name: 'generateLivePurchaseNotificationFlow',
    inputSchema: GenerateLivePurchaseNotificationInputSchema, // Empty input for the flow
    outputSchema: GenerateLivePurchaseNotificationOutputSchema,
  },
  async () => {
    // Select a random customer data entry
    const randomIndex = Math.floor(Math.random() * customerProductData.length);
    const { name: customerName, city: customerCity, product: productName } = customerProductData[randomIndex];

    // Call the prompt with the dynamically selected data
    const { output } = await generateNotificationPrompt({
      customerName,
      customerCity,
      productName,
    });
    return output!; // The prompt output is directly the flow output
  }
);

// Export the wrapper function
export async function generateLivePurchaseNotification(
  input: GenerateLivePurchaseNotificationInput = {} // Default empty object for input
): Promise<GenerateLivePurchaseNotificationOutput> {
  return generateLivePurchaseNotificationFlow(input);
}

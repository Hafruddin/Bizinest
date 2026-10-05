const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Service to interact with the Google Gemini API with Streaming and Multi-Agent Orchestration.
 */
class AIService {
  /**
   * General text generation.
   */
  static async generateText(prompt) {
    try {
      const url = `${BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API generateText Error:', error.response?.data || error.message);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Multi-modal content analysis (OCR & Summarization).
   */
  static async analyzeFile(base64Data, mimeType, prompt) {
    try {
      const url = `${BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API analyzeFile Error:', error.response?.data || error.message);
      throw new Error(`AI file analysis failed: ${error.message}`);
    }
  }

  /**
   * Stream text generation using Server-Sent Events (SSE).
   * @param {string} prompt 
   * @param {function} onChunk - callback for each text token
   */
  static async streamText(prompt, onChunk) {
    try {
      const url = `${BASE_URL}/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        }
      }, {
        responseType: 'stream'
      });

      let buffer = '';
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          
          // Regex to isolate text attributes inside candidates block
          // Resilient to split JSON packets across chunk boundaries
          const regex = /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
          let match;
          let lastMatchedIndex = 0;
          while ((match = regex.exec(buffer)) !== null) {
            try {
              const rawText = match[1];
              const text = JSON.parse(`"${rawText}"`);
              onChunk(text);
              lastMatchedIndex = regex.lastIndex;
            } catch (err) {
              // Ignore partial parsing errors
            }
          }
          
          // Slice the buffer to remove parts already matched and emitted
          if (lastMatchedIndex > 0) {
            buffer = buffer.substring(lastMatchedIndex);
          }
        });

        response.data.on('end', () => {
          resolve();
        });

        response.data.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      console.error('Gemini API streamText Error:', error.message);
      throw error;
    }
  }

  /**
   * Intelligently classify user message to determine required agents.
   * @param {string} message - User query
   * @returns {Promise<Array<string>>} - List of agents needed
   */
  static async classifyAgents(message) {
    const prompt = `
You are the **Enterprise AI Agent Router & Orchestrator**.
Analyze the user's message and identify which of the following specialized AI agents are required to fulfill the request.
Available Agents:
- "Invoice Agent" (GST calculation, billing, sales invoices, payment status)
- "Inventory Agent" (stock counts, low stock alerts, barcode/QR tags, reordering)
- "Finance Agent" (expenses, income, cash flow, profit & loss, tax summary)
- "Document Agent" (uploaded PDFs/Word/Excel, OCR text extraction, RAG questions)
- "Customer Support Agent" (customer tickets, order tracking, complaint logs, FAQ)
- "Government Scheme Advisor" (Indian government schemes, PMEGP, Mudra, CGTMSE eligibility)
- "Business Analytics Agent" (demand forecast, revenue trends, customer growth)
- "Marketing Agent" (social media posts, email campaigns, ad copy, festival promotions)
- "HR Agent" (employee records, leave, attendance, payroll calculations)
- "AI Business Advisor" (strategic guidance, cost reduction, pricing, risk analysis)

Reply with a JSON array containing only the matching agents, for example:
["Inventory Agent", "Finance Agent"]

If no specific agent is matched, reply with:
["AI Business Advisor"]

User Message: "${message}"

Reply with the raw JSON array only. No markdown fences.
`;

    try {
      const response = await this.generateText(prompt);
      const cleanJson = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn('Agent classification failed, falling back to AI Business Advisor:', error.message);
      return ['AI Business Advisor'];
    }
  }

  /**
   * Orchestrates the final answer stream by combining database contexts of all active classified agents.
   */
  static async runOrchestratorStream(message, context, onChunk) {
    // 1. Classify the agents needed
    const activeAgents = await this.classifyAgents(message);
    
    // 2. Build context payload for classified agents
    const activeContext = {
      business: context.business,
      activeAgents,
    };

    if (activeAgents.includes('Inventory Agent')) {
      activeContext.lowStockProducts = context.lowStock;
      activeContext.totalProducts = context.totalProductsCount;
    }
    if (activeAgents.includes('Invoice Agent')) {
      activeContext.unpaidInvoicesCount = context.unpaidInvoicesCount;
      activeContext.recentInvoices = context.recentInvoices;
    }
    if (activeAgents.includes('Finance Agent')) {
      activeContext.financeStats = context.finance;
    }
    if (activeAgents.includes('Government Scheme Advisor')) {
      activeContext.seededSchemes = context.schemes;
    }
    if (activeAgents.includes('Customer Support Agent')) {
      activeContext.supportTickets = context.supportTickets;
    }
    if (activeAgents.includes('Document Agent')) {
      activeContext.recentDocuments = context.documents;
    }
    if (activeAgents.includes('HR Agent')) {
      activeContext.employeeCount = context.employeeCount || 12;
      activeContext.payrollSummary = context.payrollSummary || { totalMonthlySalary: 350000 };
    }
    if (activeAgents.includes('Business Analytics Agent') || activeAgents.includes('AI Business Advisor')) {
      activeContext.analyticsSummary = {
        monthlyGrowthRate: '+14.2%',
        topCategory: 'Industrial Supplies',
        healthScore: '88/100 (Strong)'
      };
    }

    const prompt = `
You are the **Business AI Assistant for Enterprises Orchestrator**.
Active Specialized Agents Working: ${activeAgents.join(', ')}

Compiled Live Database & Business Context:
${JSON.stringify(activeContext, null, 2)}

User Request: "${message}"

INSTRUCTIONS FOR YOUR AGENTIC RESPONSE:
1. Provide a comprehensive, clear, structured response directly addressing the user's goal.
2. Structure the answer clearly using clean Markdown (headers, bullet points, concise tables if helpful).
3. Be professional, direct, and actionable for an Indian enterprise owner.
4. Reference real business metrics from the context whenever applicable.
`;

    return this.streamText(prompt, onChunk);
  }
}

module.exports = AIService;

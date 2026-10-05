const axios = require('axios');

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n-cloud.biznest.ai/assistant';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || `${N8N_BASE_URL}/webhook/biznest-orchestrator`;
const N8N_API_KEY = process.env.N8N_API_KEY || '';

/**
 * Service for communicating with n8n Cloud Automation / Orchestration Webhooks.
 */
class N8nService {
  /**
   * Dispatch request to n8n main orchestrator webhook.
   * @param {Object} payload - { userId, sessionId, message, context, intent }
   * @returns {Promise<Object>} - Structured response from n8n
   */
  static async triggerOrchestrator(payload) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (N8N_API_KEY) {
        headers['X-N8N-API-KEY'] = N8N_API_KEY;
      }

      const requestData = {
        userId: payload.userId || 'guest_user',
        sessionId: payload.sessionId || `session_${Date.now()}`,
        message: payload.message || '',
        intent: payload.intent || 'GENERAL',
        subIntent: payload.subIntent || '',
        context: payload.context || {},
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(N8N_WEBHOOK_URL, requestData, {
        headers,
        timeout: 10000, // 10 second timeout threshold
      });

      if (response.data && response.data.success !== undefined) {
        return response.data;
      }

      return {
        success: true,
        intent: payload.intent || 'GENERAL',
        message: response.data?.message || typeof response.data === 'string' ? response.data : 'Orchestrated response received',
        data: response.data?.data || response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('n8n Webhook unreachable/error, executing local fallback:', error.message);
      return {
        success: false,
        error: {
          code: 'N8N_UNREACHABLE',
          message: `n8n webhook execution fell back to backend AI engine: ${error.message}`,
        },
      };
    }
  }

  /**
   * Execute specialized sub-workflow endpoint if configured in n8n.
   */
  static async triggerSubWorkflow(workflowPath, data) {
    try {
      const url = `${N8N_BASE_URL.replace(/\/+$/, '')}/webhook/${workflowPath}`;
      const headers = { 'Content-Type': 'application/json' };
      if (N8N_API_KEY) headers['X-N8N-API-KEY'] = N8N_API_KEY;

      const response = await axios.post(url, data, { headers, timeout: 8000 });
      return response.data;
    } catch (error) {
      console.warn(`Sub-workflow ${workflowPath} failed:`, error.message);
      return null;
    }
  }
}

module.exports = N8nService;

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log('Chat API received request');
    
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Failed to parse request body', e);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Handle both useChat format (messages array) and direct message format
    const messages = body?.messages || [];
    const directMessage = body?.message;
    const creditScore = body?.creditScore;
    const creditAnalysisDate = body?.creditAnalysisDate;
    
    console.log('Messages received:', messages);
    console.log('Direct message:', directMessage);
    console.log('Credit score provided:', creditScore);
    
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const message = lastUserMessage?.content || directMessage;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API key is missing');
      return NextResponse.json({ error: 'OpenRouter API key is missing' }, { status: 500 });
    }

    // Call OpenRouter API
    console.log('Calling OpenRouter API');
    
    // Build conversation messages
    const conversationMessages = [
      {
        role: 'system',
        content: buildSystemPrompt(creditScore, creditAnalysisDate),
      }
    ];
    
    // Add conversation history if available
    if (messages.length > 0) {
      conversationMessages.push(...messages);
    } else {
      // Single message format
      conversationMessages.push({
        role: 'user',
        content: message,
      });
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'CA Advisor',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: conversationMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    console.log('OpenRouter response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json({ 
        error: 'Failed to get response from AI service',
        details: errorText
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('OpenRouter response received');
    
    const content = data.choices?.[0]?.message?.content || 'No response generated';
    
    // Return format compatible with useChat hook
    return NextResponse.json({
      id: Date.now().toString(),
      role: 'assistant',
      content: content
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

// Build enhanced system prompt with user's credit score data
function buildSystemPrompt(creditScore, creditAnalysisDate) {
  let basePrompt = 'You are TaxSage AI, a helpful Chartered Accountant and financial advisor specializing in Indian tax laws, loan eligibility, and financial planning.\n\nWhen users ask for roadmaps, plans, or strategies for financial goals (like buying something, saving, investing), provide detailed step-by-step actionable plans with specific timelines, amounts, and tax-saving strategies.';
  
  // Check if user has analyzed their credit score
  if (creditScore && creditScore !== 'null') {
    const score = parseInt(creditScore);
    let band = 'Poor';
    if (score >= 750) band = 'Excellent';
    else if (score >= 720) band = 'Very Good';  
    else if (score >= 680) band = 'Good';
    else if (score >= 650) band = 'Fair';
    
    const analysisDate = creditAnalysisDate ? new Date(creditAnalysisDate).toLocaleDateString() : 'recently';
    
    basePrompt += `\n\nIMPORTANT: The user has analyzed their credit score (${analysisDate}). Their current credit score is ${score} (${band} category). Use this information to provide personalized loan eligibility advice, interest rate estimates, and tax-saving strategies. Consider their creditworthiness when suggesting loan amounts and types.`;
    
    // Add specific context based on score band
    if (score >= 750) {
      basePrompt += '\nThey qualify for premium loan products with lowest interest rates (7-9%). Suggest tax-efficient loans like home loans (Section 80C + 24b deductions up to ₹3.5L total).';
    } else if (score >= 720) {
      basePrompt += '\nThey qualify for good loan products with competitive rates (8-11%). Focus on home loans and business loans with tax benefits.';
    } else if (score >= 680) {
      basePrompt += '\nThey qualify for standard loan products (9-13% rates). Focus on improving score while accessing necessary credit.';
    } else if (score >= 650) {
      basePrompt += '\nThey may get higher interest rates (12-16%). Suggest credit improvement before major loans.';
    } else {
      basePrompt += '\nThey may face loan rejections or very high rates (15%+). Focus on credit repair strategies first.';
    }
  } else {
    // User hasn't analyzed their credit score
    basePrompt += `\n\nIMPORTANT: The user has NOT analyzed their credit score yet. For ANY loan-related queries, banking questions, or credit advice, you MUST first direct them to check their credit score by visiting the Credit Analysis page and using their Aadhaar and PAN. Say something like: "Before I can provide specific loan advice, please first analyze your credit score by going to the Credit Analysis page and entering your Aadhaar and PAN. This will help me give you personalized recommendations based on your actual creditworthiness."`;
  }
  
  basePrompt += '\n\nProvide practical, actionable advice considering Indian financial regulations, tax laws (Sections 80C, 80D, 24b, etc.), and current market conditions. Always mention TaxSage when appropriate.';
  
  return basePrompt;
}

// Add a GET handler just to confirm the route is working
export async function GET() {
  return NextResponse.json({ status: 'Chat API is online' });
}

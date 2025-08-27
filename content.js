// maxwell corwin 2025
// content.js — injects a floating bubble + sidebar (shadow dom) and collects context

(function () {
  const STATE = { open: false, busy: false };
  let shadowRoot = null;

  // build ui once dom is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    injectBubble();
    injectPanel();
    document.addEventListener("keydown", onHotkey);
  }

  function onHotkey(e) {
    if (e.altKey && e.code === "Space") {
      e.preventDefault();
      togglePanel();
    }
  }

  function injectBubble() {
    if (document.getElementById("rc-bubble")) return;
    const bubble = document.createElement("div");
    bubble.id = "rc-bubble";
    bubble.textContent = "✦";
    Object.assign(bubble.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "bold",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
      cursor: "pointer",
      zIndex: 2147483647,
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.2)"
    });
    bubble.title = "reading assistant (alt+space)";
    bubble.addEventListener("click", togglePanel);
    bubble.addEventListener("mouseenter", () => {
      bubble.style.transform = "scale(1.1)";
      bubble.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.4)";
    });
    bubble.addEventListener("mouseleave", () => {
      bubble.style.transform = "scale(1)";
      bubble.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.3)";
    });
    document.documentElement.appendChild(bubble);
  }

  function injectPanel() {
    if (document.getElementById("rc-root")) return;
    const root = document.createElement("div");
    root.id = "rc-root";
    root.style.all = "initial";
    root.style.position = "fixed";
    root.style.top = 0;
    root.style.right = 0;
    root.style.height = "100vh";
    root.style.width = "0";
    root.style.zIndex = 2147483646;
    root.style.transition = "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    document.documentElement.appendChild(root);
    shadowRoot = root.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.id = "rc-wrapper";
    wrapper.innerHTML = `
      <style>
        :host { all: initial; }
        * { box-sizing: border-box; }
        
        .panel { 
          width: 400px; 
          height: 100vh; 
          background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%);
          color: #e2e8f0; 
          border-left: 1px solid #2d3748; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          display: flex; 
          flex-direction: column;
          backdrop-filter: blur(10px);
        }
        
        .header { 
          padding: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          border-bottom: 1px solid #2d3748;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .brand { 
          font-weight: 700; 
          font-size: 18px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        
        .close { 
          background: transparent; 
          color: #a0aec0; 
          border: none; 
          font-size: 24px; 
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close:hover { 
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        .main { 
          padding: 20px; 
          overflow: auto; 
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .chips { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 8px; 
          margin-bottom: 16px; 
        }
        
        .chip { 
          font-size: 13px; 
          padding: 8px 12px; 
          background: rgba(255, 255, 255, 0.1); 
          color: #e2e8f0; 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 20px; 
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .chip:hover { 
          background: rgba(102, 126, 234, 0.3);
          border-color: #667eea;
          transform: translateY(-1px);
        }
        
        textarea { 
          width: 100%; 
          min-height: 80px; 
          resize: vertical; 
          background: rgba(255, 255, 255, 0.05); 
          color: #e2e8f0; 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 12px; 
          padding: 16px; 
          outline: none;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        textarea:focus { 
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .send { 
          width: 100%; 
          padding: 14px 20px; 
          border-radius: 12px; 
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; 
          border: none; 
          font-weight: 600; 
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .send:hover:not([disabled]) { 
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .send[disabled] { 
          opacity: 0.6; 
          cursor: not-allowed;
          transform: none;
        }
        
        .answer { 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          margin-top: 20px; 
        }
        
        .bullet { 
          padding: 16px; 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 12px; 
          border-left: 4px solid #667eea;
          line-height: 1.6;
          font-size: 14px;
        }
        
        .uncertainty { 
          font-size: 12px; 
          color: #a0aec0; 
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          text-align: center;
        }
        
        .citations { 
          font-size: 12px; 
          color: #718096; 
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .error { 
          color: #fc8181; 
          background: rgba(252, 129, 129, 0.1); 
          padding: 16px; 
          border-radius: 12px;
          border: 1px solid rgba(252, 129, 129, 0.3);
          font-size: 14px;
        }
        
        .loading { 
          text-align: center; 
          color: #a0aec0; 
          padding: 40px 20px;
          font-size: 14px;
        }
        
        .loading::after {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #667eea;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
          margin-left: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      </style>
      <div class="panel">
        <div class="header">
          <div class="brand">reading assistant</div>
          <button class="close">×</button>
        </div>
        <div class="main">
          <div class="chips">
            <div class="chip">summarize</div>
            <div class="chip">key points</div>
            <div class="chip">explain</div>
            <div class="chip">questions</div>
          </div>
          <textarea placeholder="ask a question about what you're reading..." id="question-input"></textarea>
          <button class="send" id="send-btn">ask question</button>
          <div class="answer" id="answer-container"></div>
        </div>
      </div>
    `;

    shadowRoot.appendChild(wrapper);

    // wire up the close button
    const closeBtn = shadowRoot.querySelector('.close');
    closeBtn.addEventListener('click', togglePanel);

    // wire up the send button
    const sendBtn = shadowRoot.querySelector('#send-btn');
    const questionInput = shadowRoot.querySelector('#question-input');
    
    sendBtn.addEventListener('click', askQuestion);
    questionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        askQuestion();
      }
    });

    // wire up quick chips
    const chips = shadowRoot.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.toLowerCase();
        let question = '';
        switch(text) {
          case 'summarize': question = 'summarize the main points'; break;
          case 'key points': question = 'what are the key arguments?'; break;
          case 'explain': question = 'explain this in simpler terms'; break;
          case 'questions': question = 'what questions does this raise?'; break;
        }
        questionInput.value = question;
        questionInput.focus();
      });
    });
  }

  function togglePanel() {
    const root = document.getElementById("rc-root");
    if (!root) return;
    
    STATE.open = !STATE.open;
    root.style.width = STATE.open ? "400px" : "0";
    
    if (STATE.open) {
      const input = shadowRoot.querySelector('#question-input');
      if (input) input.focus();
    }
  }

  function collectContext() {
    const spans = [];
    let id = 0;
    
    // get selected text first
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      if (text.length > 20) {
        spans.push({ id: `s${id++}`, text: text.substring(0, 1000) });
      }
    }
    
    // get visible text content from main content areas
    const selectors = [
      'article', 'main', '.content', '.post', '.entry',
      '[role="main"]', '.article', '.story', '.text'
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (isElementVisible(el)) {
          const text = el.textContent.trim();
          if (text.length > 100) {
            spans.push({ id: `p${id++}`, text: text.substring(0, 2000) });
            break; // only take first major content area
          }
        }
      }
    }
    
    // fallback: get text from paragraphs if no major content areas found
    if (spans.length === 0) {
      const paragraphs = document.querySelectorAll('p');
      let totalText = '';
      for (const p of paragraphs) {
        if (isElementVisible(p)) {
          totalText += p.textContent.trim() + ' ';
          if (totalText.length > 1000) break;
        }
      }
      if (totalText.trim()) {
        spans.push({ id: 'p0', text: totalText.trim() });
      }
    }
    
    return spans;
  }

  function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           rect.top < window.innerHeight && rect.bottom > 0;
  }

  async function askQuestion() {
    if (STATE.busy) return;
    
    const questionInput = shadowRoot.querySelector('#question-input');
    const sendBtn = shadowRoot.querySelector('#send-btn');
    const answerContainer = shadowRoot.querySelector('#answer-container');
    
    const question = questionInput.value.trim();
    if (!question) return;
    
    STATE.busy = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'asking...';
    
    // clear previous answer
    answerContainer.innerHTML = '<div class="loading">thinking...</div>';
    
    try {
      const spans = collectContext();
      if (spans.length === 0) {
        throw new Error("no readable content found on this page. try selecting some text first.");
      }
      
      const meta = {
        title: document.title,
        url: window.location.href
      };
      
      const response = await chrome.runtime.sendMessage({
        type: "ASK_LLM",
        payload: { question, meta, spans }
      });
      
      if (!response.ok) {
        throw new Error(response.error || "failed to get response");
      }
      
      displayAnswer(response.result);
      
    } catch (error) {
      answerContainer.innerHTML = `<div class="error">error: ${error.message}</div>`;
    } finally {
      STATE.busy = false;
      sendBtn.disabled = false;
      sendBtn.textContent = 'ask question';
    }
  }

  function displayAnswer(result) {
    const answerContainer = shadowRoot.querySelector('#answer-container');
    
    let html = '';
    
    // display bullet points
    if (result.answer_bullets && result.answer_bullets.length > 0) {
      html += '<div class="bullets">';
      result.answer_bullets.forEach(bullet => {
        html += `<div class="bullet">${bullet}</div>`;
      });
      html += '</div>';
    }
    
    // display uncertainty
    if (typeof result.uncertainty === 'number') {
      const confidence = Math.round((1 - result.uncertainty) * 100);
      html += `<div class="uncertainty">confidence: ${confidence}%</div>`;
    }
    
    // display citations if any
    if (result.citations && result.citations.length > 0) {
      html += '<div class="citations">based on: ' + 
        result.citations.map(c => c.span_id || c.id || 'text').join(', ') + '</div>';
    }
    
    answerContainer.innerHTML = html;
  }
})();
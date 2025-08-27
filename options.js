// maxwell corwin 2025
// options.js — handles extension settings and configuration

const DEFAULTS = {
  provider: "openai",
  model: "gpt-4o-mini",
  openaiKey: "",
  localEndpoint: "http://localhost:11434",
  localOnly: false
};

async function restore() {
  const s = await chrome.storage.local.get(DEFAULTS);
  provider.value = s.provider;
  model.value = s.model;
  openaiKey.value = s.openaiKey;
  localEndpoint.value = s.localEndpoint;
  localOnly.checked = !!s.localOnly;
  updateProviderUI();
}

async function save() {
  await chrome.storage.local.set({
    provider: provider.value,
    model: model.value.trim() || DEFAULTS.model,
    openaiKey: openaiKey.value.trim(),
    localEndpoint: localEndpoint.value.trim() || DEFAULTS.localEndpoint,
    localOnly: localOnly.checked
  });
  showStatus("settings saved successfully!", "success");
}

async function test() {
  showStatus("testing connection...", "info");
  
  try {
    const res = await chrome.runtime.sendMessage({
      type: "ASK_LLM",
      payload: {
        question: "say 'ok' as json with answer_bullets.",
        meta: { title: "self-test", url: "options" },
        spans: [{ id: "p0", text: "this is a self test." }]
      }
    });
    
    if (!res?.ok) {
      throw new Error(res?.error || "background returned no response");
    }
    
    showStatus("connection test successful!", "success");
  } catch (e) {
    showStatus("test failed: " + (e.message || String(e)), "error");
  }
}

function updateProviderUI() {
  const selectedProvider = provider.value;
  
  // hide all config sections
  document.getElementById('openai-config').style.display = 'none';
  document.getElementById('ollama-config').style.display = 'none';
  
  // show relevant config section
  if (selectedProvider === 'openai') {
    document.getElementById('openai-config').style.display = 'block';
  } else if (selectedProvider === 'ollama') {
    document.getElementById('ollama-config').style.display = 'block';
  }
}

function showStatus(message, type = "info") {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = "block";
  
  // auto-hide success messages
  if (type === "success") {
    setTimeout(() => {
      status.style.display = "none";
    }, 3000);
  }
}

// wire up events
document.getElementById("save").addEventListener("click", save);
document.getElementById("test").addEventListener("click", test);
provider.addEventListener("change", updateProviderUI);

// cache element refs
const provider = document.getElementById("provider");
const model = document.getElementById("model");
const openaiKey = document.getElementById("openaiKey");
const localEndpoint = document.getElementById("localEndpoint");
const localOnly = document.getElementById("localOnly");

// initialize
restore();
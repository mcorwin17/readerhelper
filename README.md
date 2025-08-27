# Reading Assistant Chrome Extension

A modern, AI-powered Chrome extension that helps you understand and analyze any webpage content. Ask questions about what you're reading and get intelligent, contextual responses.

![Reading Assistant](https://img.shields.io/badge/Chrome-Extension-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎯 Smart Context Detection** - Automatically identifies and collects relevant text from web pages
- **🤖 AI-Powered Analysis** - Get intelligent responses using OpenAI or local Ollama
- **🎨 Modern UI** - Beautiful, responsive interface with smooth animations
- **⚡ Quick Access** - Floating bubble or keyboard shortcut (Alt+Space)
- **🔒 Privacy-First** - All processing happens locally or through your own API
- **📱 Responsive Design** - Works perfectly on all screen sizes

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mcorwin17/readerhelper.git
   cd readerhelper
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `readerhelper` folder
   - The extension will appear in your toolbar

3. **Configure AI Provider**
   - Click the extension icon → "Options"
   - Choose your preferred AI provider:
     - **OpenAI**: Enter your API key
     - **Ollama**: Use local AI models
   - Test the connection

### Usage

1. **Navigate to any webpage** with text content
2. **Click the floating ✦ bubble** or press **Alt+Space**
3. **Ask questions** like:
   - "Summarize the main points"
   - "What are the key arguments?"
   - "Explain this in simpler terms"
   - "What questions does this raise?"

## 🛠️ Configuration

### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Open extension options
3. Select "OpenAI" provider
4. Enter your API key
5. Choose your preferred model (default: gpt-4o-mini)

### Ollama Setup (Local)
1. Install [Ollama](https://ollama.ai/)
2. Run `ollama serve` in terminal
3. Open extension options
4. Select "Ollama" provider
5. Ensure endpoint is `http://localhost:11434`

## 📁 Project Structure

```
readerhelper/
├── manifest.json      # Extension configuration
├── background.js      # Service worker for API communication
├── content.js         # UI injection and page interaction
├── options.html       # Settings page
├── options.js         # Options page logic
└── README.md          # This file
```

## 🎨 UI Components

- **Floating Bubble**: Gradient-styled button with hover effects
- **Sidebar Panel**: Modern dark theme with smooth transitions
- **Quick Chips**: Pre-filled common questions
- **Loading States**: Animated indicators and progress feedback
- **Responsive Design**: Adapts to different screen sizes

## 🔧 Development

### Prerequisites
- Chrome browser
- Git
- Text editor

### Local Development
1. Clone the repository
2. Make changes to the code
3. Reload the extension in Chrome
4. Test your changes

### Building for Distribution
1. Ensure all files are properly formatted
2. Test thoroughly in Chrome
3. Create a ZIP file of the extension
4. Submit to Chrome Web Store (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better reading comprehension tools
- Uses OpenAI API for intelligent responses

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/mcorwin17/readerhelper/issues) page
2. Create a new issue with detailed information
3. Include browser version and error messages

---

**Made with ❤️ by Maxwell Corwin**

*Transform your reading experience with AI-powered insights*

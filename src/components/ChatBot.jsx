import { useState, useRef, useEffect } from 'react'
import { api } from '../api/client'
import './ChatBot.css'

const BOT_NAME = 'KnowBot'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm KnowBot, your psychology companion. Ask me anything about mental wellness, emotions, stress, anxiety, or psychology. How can I help you today?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const { reply } = await api.postChat({ message: text, history })
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message || 'Failed to get response. Please try again.')
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't process that. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`chatbot-panel ${open ? 'chatbot-panel-open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">Ψ</span>
            <div>
              <h3 className="chatbot-title">{BOT_NAME}</h3>
              <span className="chatbot-subtitle">Psychology & mental wellness</span>
            </div>
          </div>
          <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg chatbot-msg-${msg.role}`}>
              {msg.role === 'assistant' && <span className="chatbot-msg-avatar">Ψ</span>}
              <div className="chatbot-msg-bubble">
                <p className="chatbot-msg-text">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg chatbot-msg-assistant">
              <span className="chatbot-msg-avatar">Ψ</span>
              <div className="chatbot-msg-bubble chatbot-typing">
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="chatbot-error" role="alert">
            {error}
          </div>
        )}

        <form className="chatbot-input-wrap" onSubmit={handleSend}>
          <input
            type="text"
            className="chatbot-input"
            placeholder="Ask about psychology, emotions, stress..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="chatbot-send" disabled={loading || !input.trim()} aria-label="Send">
            →
          </button>
        </form>
      </div>

      <button
        type="button"
        className="chatbot-button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="chatbot-button-icon">Ψ</span>
      </button>
    </>
  )
}

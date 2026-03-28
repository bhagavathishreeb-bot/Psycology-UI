import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { CONFIG } from '../config'
import './ChatBot.css'

const BOT_NAME = 'Taara'

const WELCOME_BODY =
  "Ask me anything about psychology, mental wellness, or whatever makes sense for you — I'm here to help."

const TEASER_SEEN_KEY = 'taara-welcome-teaser-seen'

const USER_MESSAGES_BEFORE_BOOKING_PROMPT = 2

export default function ChatBot() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm ${BOT_NAME}. ${WELCOME_BODY}` },
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
  }, [messages, loading])

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    if (sessionStorage.getItem(TEASER_SEEN_KEY)) return

    const show = window.setTimeout(() => setShowTeaser(true), 450)
    const hide = window.setTimeout(() => {
      setShowTeaser(false)
      sessionStorage.setItem(TEASER_SEEN_KEY, '1')
    }, 12000)

    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  const dismissTeaser = (remember) => {
    setShowTeaser(false)
    if (remember && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TEASER_SEEN_KEY, '1')
    }
  }

  const openChat = () => {
    dismissTeaser(true)
    setOpen(true)
  }

  const toggleChat = () => {
    if (!open) {
      dismissTeaser(true)
    }
    setOpen(!open)
  }

  const userMessageCount = useMemo(
    () => messages.filter((m) => m.role === 'user').length,
    [messages],
  )

  const showBookingPrompt =
    userMessageCount >= USER_MESSAGES_BEFORE_BOOKING_PROMPT && !loading

  const goToBooking = () => {
    const session = CONFIG.sessions?.[0] ?? null
    setOpen(false)
    navigate('/book', { state: session ? { session } : undefined })
  }

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

        {showBookingPrompt && (
          <div className="chatbot-booking-prompt">
            <p className="chatbot-booking-prompt-text">
              Want to go deeper? Book a{' '}
              <span className="chatbot-booking-prompt-highlight">one-to-one session</span> with Bhagavathi.
            </p>
            <button type="button" className="chatbot-booking-prompt-btn" onClick={goToBooking}>
              Book a session
            </button>
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

      {showTeaser && !open && (
        <div className="chatbot-teaser" role="dialog" aria-label="Taara welcome">
          <span className="chatbot-teaser-sparkle chatbot-teaser-sparkle-a" aria-hidden />
          <span className="chatbot-teaser-sparkle chatbot-teaser-sparkle-b" aria-hidden />
          <span className="chatbot-teaser-sparkle chatbot-teaser-sparkle-c" aria-hidden />
          <button
            type="button"
            className="chatbot-teaser-close"
            onClick={() => dismissTeaser(true)}
            aria-label="Dismiss"
          >
            ×
          </button>
          <div className="chatbot-teaser-inner">
            <div className="chatbot-teaser-top">
              <span className="chatbot-teaser-avatar" aria-hidden>
                <span className="chatbot-teaser-avatar-ring" />
                Ψ
              </span>
              <div className="chatbot-teaser-intro">
                <span className="chatbot-teaser-pill">Your AI companion</span>
                <h2 className="chatbot-teaser-headline">
                  Hey there! <span aria-hidden>👋</span>
                </h2>
                <p className="chatbot-teaser-byline">
                  I&apos;m <strong>{BOT_NAME}</strong>
                </p>
              </div>
            </div>
            <p className="chatbot-teaser-text">{WELCOME_BODY}</p>
            <button type="button" className="chatbot-teaser-cta" onClick={openChat}>
              <span>Start a conversation</span>
              <span className="chatbot-teaser-cta-arrow" aria-hidden>
                →
              </span>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chatbot-button"
        onClick={toggleChat}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="chatbot-button-icon">Ψ</span>
      </button>
    </>
  )
}

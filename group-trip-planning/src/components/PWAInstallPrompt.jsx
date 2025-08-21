import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom install prompt
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      // Clear the deferredPrompt variable
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Remember user dismissed for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  // Don't show if user already dismissed or if we don't have the prompt event
  if (!showInstallPrompt || !deferredPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          padding: '8px',
          flexShrink: 0
        }}>
          <Download style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937'
          }}>
            Install TravelMate
          </h3>
          <p style={{ 
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.4'
          }}>
            Install our app for a better experience with offline access and native features
          </p>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleInstallClick}
              className="btn-primary"
              style={{ 
                fontSize: '14px',
                padding: '8px 16px'
              }}
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="btn-secondary"
              style={{ 
                fontSize: '14px',
                padding: '8px 16px'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: '#9ca3af',
            flexShrink: 0
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  )
}

export default PWAInstallPrompt

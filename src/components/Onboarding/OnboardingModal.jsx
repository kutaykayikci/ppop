import React, { useState } from 'react'
import PixelCard from '@/components/PixelCard'
import PixelButton from '@/components/PixelButton'

export default function OnboardingModal({ onClose, onPrimary }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "👋 Hoş Geldin!",
      content: "Poop Count'a hoş geldin! Bu eğlenceli uygulama ile sevgilinle birlikte günlük poop sayılarınızı takip edebilir, hedefler belirleyebilir ve birbirinizi motive edebilirsiniz.",
      emoji: "💩"
    },
    {
      title: "🏠 Oda Oluştur",
      content: "İlk olarak bir oda oluştur veya mevcut bir odaya katıl. Her oda benzersiz bir ID'ye sahip ve sadece sen ve sevgilin erişebilirsiniz.",
      emoji: "🏠"
    },
    {
      title: "👤 Karakter Oluştur",
      content: "Kendin için bir karakter oluştur! İsim, avatar ve kişilik özelliklerini seç. Bu karakter senin poop sayma yolculuğunda seni temsil edecek.",
      emoji: "👤"
    },
    {
      title: "🎯 Hedef Belirle",
      content: "Günlük poop hedefini belirle! Bu hedefe ulaştığında başarılar kazanacak ve sevgilinle rekabet edebileceksin.",
      emoji: "🎯"
    },
    {
      title: "📊 Takip Et",
      content: "Her poop'u kaydet ve ilerlemeni takip et! İstatistiklerini gör, başarılarını kazan ve sevgilinle karşılaştır.",
      emoji: "📊"
    },
    {
      title: "🏆 Başarılar",
      content: "Hedeflerine ulaştığında özel başarılar kazan! Bu başarılar seni motive edecek ve poop sayma yolculuğunu daha eğlenceli hale getirecek.",
      emoji: "🏆"
    },
    {
      title: "💕 Partner Sinerjisi",
      content: "Sevgilinle birlikte çalışarak özel sinerji bonusları kazanabilirsiniz! Birlikte daha fazla başarı elde edin.",
      emoji: "💕"
    },
    {
      title: "🚀 Hazır mısın?",
      content: "Artık her şey hazır! Oda oluştur veya mevcut bir odaya katıl ve poop sayma macerana başla!",
      emoji: "🚀"
    }
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      onPrimary()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.7)', 
      zIndex: 1200, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <PixelCard style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '30px',
        position: 'relative',
        animation: 'fade-in-up 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '3px solid #333', 
          paddingBottom: '15px', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>{currentStepData.emoji}</span>
            {currentStepData.title}
          </div>
          <button 
            onClick={handleSkip} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          marginBottom: '25px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {currentStepData.content}
        </div>

        {/* Progress Bar */}
        <div style={{ 
          marginBottom: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            transition: 'width 0.3s ease',
            borderRadius: '10px'
          }} />
        </div>

        {/* Step Counter */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '20px' 
        }}>
          {currentStep + 1} / {steps.length}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <PixelButton 
            variant="secondary" 
            onClick={handleSkip}
            style={{ minWidth: '100px' }}
          >
            Atla
          </PixelButton>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isFirstStep && (
              <PixelButton 
                variant="secondary" 
                onClick={handlePrevious}
                style={{ minWidth: '80px' }}
              >
                ← Geri
              </PixelButton>
            )}
            
            <PixelButton 
              onClick={handleNext}
              style={{ minWidth: '100px' }}
            >
              {isLastStep ? 'Başla!' : 'İleri →'}
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </div>
  )
}



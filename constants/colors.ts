export const AppColors = {
  // Brand colors (Defaulting to Neon Red for Auth screens)
  primary: '#ff073a', // Neon Red
  primaryDark: '#cc002c', // Darker Neon Red
  accent: '#ff2a54', // Accent Neon Pink-Red
  accentLight: '#ff6685',
  accentBg: 'rgba(255, 7, 58, 0.1)',
  
  // States/Feedback
  error: '#ff3b30', // Red error
  success: '#34c759', // Green success
  warning: '#ff9500', // Orange warning
  
  // Theme Backgrounds (Default)
  bgLight: '#f8fafc',
  bgCardLight: '#ffffff',
  bgDark: '#0f172a',
  bgCardDark: 'rgba(22, 23, 34, 0.97)',
  
  // Texts
  textDark: '#0f172a',
  textLight: '#f3f4f6',
  textMuted: '#64748b',
  textMutedDark: '#9ca3af',
  
  // Borders
  borderLight: '#e2e8f0',
  borderDark: 'rgba(255, 255, 255, 0.1)',

  // Gradients (Neon Red theme for login/register screen)
  gradientLogin: ['#080101', '#1f0003', '#000000'] as const,
  gradientBtn: ['#ff073a', '#99001b'] as const,
  gradientLogo: ['#ff073a', '#ff3366'] as const,
  gradientHighlight: ['#ff073a', '#ff3366'] as const,
  gradientOverlay: ['#ff073a', '#99001b'] as const,
  
  // Social login specific colors
  socialGoogle: '#34a853',
  socialFacebook: '#1877f2',
  socialTiktok: '#fe2c55',
  socialGithub: '#ffffff',
};

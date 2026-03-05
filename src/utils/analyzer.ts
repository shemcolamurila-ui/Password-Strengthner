
export interface AnalysisResult {
  entropy: number;
  score: number; // 0 to 100
  label: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  patterns: string[];
  crackTime: string;
  isBreached?: boolean;
  breachCount?: number;
}

export function analyzePassword(password: string): AnalysisResult {
  if (!password) {
    return { entropy: 0, score: 0, label: 'Weak', patterns: [], crackTime: '0 seconds' };
  }

  const length = password.length;
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;

  // 1. Basic Entropy Calculation
  const entropy = length * Math.log2(charsetSize || 1);

  // 2. Pattern Detection & Penalties
  const patterns: string[] = [];
  let penalty = 0;

  // Sequential characters (abc, 123)
  const sequences = ['abcdefghijklmnopqrstuvwxyz', '01234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const sub = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(sub)) {
        patterns.push(`Sequential pattern found: "${sub}"`);
        penalty += 15;
      }
    }
  }

  // Repeating characters (aaa)
  const repeats = /(.)\1{2,}/g;
  if (repeats.test(password)) {
    patterns.push('Repeating characters detected');
    penalty += 10;
  }

  // Common dictionary-like words (mock check for demo)
  const commonWords = ['password', 'admin', 'welcome', 'login', 'qwerty', '123456'];
  for (const word of commonWords) {
    if (password.toLowerCase().includes(word)) {
      patterns.push(`Common word detected: "${word}"`);
      penalty += 20;
    }
  }

  // 3. Integrated Scoring
  // Base score from entropy (capped at 100)
  // 0-28: Weak, 28-50: Moderate, 50-75: Strong, 75+: Very Strong
  let score = Math.min(100, (entropy / 80) * 100);
  
  // Apply penalties
  score = Math.max(0, score - penalty);

  // 4. Labeling
  let label: AnalysisResult['label'] = 'Weak';
  if (score > 75) label = 'Very Strong';
  else if (score > 50) label = 'Strong';
  else if (score > 25) label = 'Moderate';

  // 5. Crack Time Estimation (Very rough)
  // Assuming 10 billion guesses per second
  const guesses = Math.pow(2, entropy);
  const seconds = guesses / 1e10;
  
  let crackTime = '';
  if (seconds < 1) crackTime = 'Instantly';
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 3153600000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = 'Centuries';

  return { entropy, score, label, patterns, crackTime };
}

export async function checkHIBP(password: string): Promise<{ isBreached: boolean; count: number }> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();
    
    const lines = text.split('\n');
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        return { isBreached: true, count: parseInt(count, 10) };
      }
    }
    
    return { isBreached: false, count: 0 };
  } catch (error) {
    console.error('HIBP Check failed:', error);
    return { isBreached: false, count: 0 };
  }
}

export function strengthenPassword(password: string): { suggestions: string[]; strongerVersion: string } {
  const suggestions: string[] = [];
  let stronger = password;

  if (password.length < 12) {
    suggestions.push('Increase length to at least 12 characters.');
    // Add some random characters to make it longer
    const extra = 'x!2A';
    stronger += extra;
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters.');
    stronger = stronger.charAt(0).toUpperCase() + stronger.slice(1);
  }

  if (!/[0-9]/.test(password)) {
    suggestions.push('Include numbers.');
    stronger += '7';
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Use special characters (e.g., !, @, #).');
    stronger += '!';
  }

  // If it's still too short or weak, just generate a better one
  if (password.length < 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    stronger = result;
    suggestions.push('Your password is too short. Try a completely random one.');
  }

  return { suggestions, strongerVersion: stronger };
}

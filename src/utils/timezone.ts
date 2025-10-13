/**
 * Timezone utilities for Mumbai, India (IST - Indian Standard Time)
 * UTC+5:30
 */

/**
 * Get the current hour in Mumbai timezone (IST)
 * @returns Hour in 24-hour format (0-23)
 */
export const getMumbaiHour = (): number => {
  // Create a date in Mumbai timezone
  const mumbaiTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hour12: false
  });
  
  return parseInt(mumbaiTime, 10);
};

/**
 * Get greeting based on Mumbai timezone
 * Morning: 5 AM - 11:59 AM
 * Afternoon: 12 PM - 4:59 PM
 * Evening: 5 PM - 8:59 PM
 * Night: 9 PM - 4:59 AM
 * @returns Greeting string and emoji
 */
export const getGreetingForMumbai = (): { greeting: string; emoji: string } => {
  const hour = getMumbaiHour();
  
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good Morning', emoji: '🌅' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good Afternoon', emoji: '☀️' };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good Evening', emoji: '🌆' };
  } else {
    return { greeting: 'Good Night', emoji: '🌙' };
  }
};

/**
 * Get current time in Mumbai
 * @returns Formatted time string
 */
export const getMumbaiTime = (): string => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

/**
 * Get current date in Mumbai
 * @returns Formatted date string
 */
export const getMumbaiDate = (): string => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

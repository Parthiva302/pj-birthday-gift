// ============================================
// BIRTHDAY CELEBRATION - CONFIGURATION
// Edit this file to customize the website
// ============================================

export const CONFIG = {
  // Birthday person's name
  name: "Poojya",

  // Hero section subtitle
  subtitle: "A Magical Celebration Created Just For You",

  // Greeting line (Message section)
  greeting: "My Dearest Poojya,",

  // Birthday message body
  message:
    "Today isn't just a date on the calendar — it's a celebration of the incredible light you bring into every life you touch. Every moment with you feels like a scene from the most beautiful movie ever made, and I'm endlessly grateful to share this story with you. May this new year of your life be overflowing with love, laughter, and all the magic your heart can hold. You deserve the universe and more. Happy Birthday! 🎂✨",

  // Profile photo of the birthday person
  profilePhoto: "/gallery/image.jpeg",

  // Gallery images — add more photos here
  galleryImages: [
    { src: "/gallery/image.jpeg", caption: "The most beautiful soul I know 💖" },
  ],

  // Background music path
  musicPath: "/music/birthday.mpeg",

  // Theme colors
  theme: {
    accent: "#ff2d55",
    accentGlow: "rgba(255, 45, 85, 0.5)",
    gold: "#d4af37",
    purple: "#6c5ce7",
    teal: "#00b894",
    warmYellow: "#fdcb6e",
    bgDark: "#0a0a0f",
  },
} as const;

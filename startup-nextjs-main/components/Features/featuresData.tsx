import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      // Book/learning icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#EEF2FF"/><path d="M12 28V14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" stroke="#6366F1" strokeWidth="2"/><path d="M12 28c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2" stroke="#6366F1" strokeWidth="2"/><path d="M16 18h8M16 22h8" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Innovative Learning Experience",
    paragraph:
      "Dive into workshops, tech talks, and hands-on challenges curated for students and professionals.",
  },
  {
    id: 2,
    icon: (
      // Networking/people icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#F0FDF4"/><circle cx="20" cy="16" r="4" stroke="#22C55E" strokeWidth="2"/><path d="M12 28c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#22C55E" strokeWidth="2"/></svg>
    ),
    title: "Networking Opportunities",
    paragraph:
      "Connect with industry leaders, startups, and like-minded peers in a collaborative environment.",
  },
  {
    id: 3,
    icon: (
      // Tracks icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#FFF7ED"/><path d="M12 28V12h16v16H12z" stroke="#FB923C" strokeWidth="2"/><path d="M16 16h8v8h-8v-8z" stroke="#FB923C" strokeWidth="2"/></svg>
    ),
    title: "Tailored Tracks",
    paragraph:
      "Choose from multiple tracks designed for different skill levels and career goals.",
  },
  {
    id: 4,
    icon: (
      // Agenda/calendar icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#F0F9FF"/><rect x="12" y="16" width="16" height="12" stroke="#0EA5E9" strokeWidth="2"/><path d="M16 12v4M24 12v4" stroke="#0EA5E9" strokeWidth="2"/></svg>
    ),
    title: "Personalized Agenda",
    paragraph:
      "Build your own schedule and get AI-powered session recommendations based on your profile.",
  },
  {
    id: 5,
    icon: (
      // Check-in/QR icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#FEF2F2"/><rect x="14" y="14" width="4" height="4" stroke="#EF4444" strokeWidth="2"/><rect x="22" y="14" width="4" height="4" stroke="#EF4444" strokeWidth="2"/><rect x="14" y="22" width="4" height="4" stroke="#EF4444" strokeWidth="2"/><rect x="22" y="22" width="4" height="4" stroke="#EF4444" strokeWidth="2"/></svg>
    ),
    title: "Seamless Check-In",
    paragraph:
      "Paperless QR code check-in for a smooth, hassle-free experience at the venue.",
  },
  {
    id: 6,
    icon: (
      // Prize/award icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="fill-current"><rect width="40" height="40" rx="8" fill="#F3F0FF"/><circle cx="20" cy="18" r="6" stroke="#8B5CF6" strokeWidth="2"/><path d="M16 28l2-4h4l2 4" stroke="#8B5CF6" strokeWidth="2"/></svg>
    ),
    title: "Recognition & Prizes",
    paragraph:
      "Compete in challenges, showcase your projects, and win exciting rewards and certificates.",
  },
];
export default featuresData;

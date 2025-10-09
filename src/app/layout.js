import './globals.css';
import Link from 'next/link';


export const metadata = {
  title: 'LearnToType - Master Your Typing Skills',
  description: 'Intuitive Typing Practice Platform',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <header className="header">
          <div className="nav-container">
            <Link href="/" className="logo">LearnToType</Link>
            <nav>
              <ul className="nav-links">
                <li><Link href="/">Test</Link></li>
                <li><Link href="/lessons">Lessons</Link></li>
                <li><Link href="/games">Games</Link></li>
                <li><Link href="/progress">Progress</Link></li>
                <li><Link href="/leaderboard">Leaderboard</Link></li>
              </ul>
            </nav>
            <div className="user-menu">
              <div className="user-avatar">U</div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

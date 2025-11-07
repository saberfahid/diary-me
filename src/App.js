import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import DiaryEditor from './components/DiaryEditor';
import DiaryList from './components/DiaryList';
import LandingPage from './components/LandingPage';
// ...existing code...
function App() {
  const [refreshList, setRefreshList] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('diary_logged_in') === 'true';
  });

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    localStorage.removeItem('diary_logged_in');
    localStorage.removeItem('diary_last_written');
  };

  // Handle auth state changes (including after email confirmation)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('App.js: Auth state change:', event, 'Session:', session);
      // Temporarily allow any authenticated user (for debugging)
      if (session?.user) {
        console.log('App.js: User authenticated, setting logged in');
        setLoggedIn(true);
        localStorage.setItem('diary_logged_in', 'true');
      } else if (event === 'SIGNED_OUT') {
        console.log('App.js: User signed out');
        setLoggedIn(false);
        localStorage.setItem('diary_logged_in', 'false');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('diary_logged_in', loggedIn ? 'true' : 'false');
  }, [loggedIn]);

  // Supabase keepalive system (works for all visitors)
  useEffect(() => {
    const keepalive = async () => {
      try {
        // Perform lightweight database query to keep Supabase awake
        const { data } = await supabase
          .from('diary_entries')
          .select('id')
          .limit(1);
        
        console.log('Supabase keepalive successful:', { count: data?.length || 0 });
      } catch (err) {
        console.log('Supabase keepalive error:', err.message);
      }
    };

    // Initial keepalive for any visitor (logged in or not)
    keepalive();
    
    // Set up frequent interval for keepalive (every 2 minutes when user is active)
    const interval = setInterval(keepalive, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // Removed loggedIn dependency - now runs for all visitors

  // Additional logged-in user keepalive (very frequent for active users)
  useEffect(() => {
    if (!loggedIn) return;

    const loggedInKeepalive = async () => {
      try {
        // More comprehensive keepalive for logged-in users with auto-sync
        const { data } = await supabase
          .from('diary_entries')
          .select('id')
          .limit(1);
        
        console.log('Logged-in user automatic keepalive:', { count: data?.length || 0 });
      } catch (err) {
        console.log('Logged-in keepalive error:', err.message);
      }
    };

    // Very frequent keepalive for active users (every 1 minute for instant sync)
    const interval = setInterval(loggedInKeepalive, 1 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loggedIn]);

  // Notification reminder system
  useEffect(() => {
    // Helper: get today's date string
    const getToday = () => new Date().toISOString().slice(0, 10);

    // Helper: get ms until 9pm local time, but every 2 days
    const msUntil9pm = () => {
      const now = new Date();
      const ninePm = new Date(now);
      ninePm.setHours(21, 0, 0, 0);
      if (now > ninePm) {
        ninePm.setDate(ninePm.getDate() + 2); // Next notification in 2 days
      }
      return ninePm - now;
    };

    // Cute/funny notification messages
    const messages = [
      "Hey diary superstar! 🌟 Time to spill today's tea! ☕🐱",
      "Your diary misses you! 🥺 Write a memory and make it smile! 😁",
      "Don't let your thoughts escape! 🦄✨ Jot them down!",
      "Pssst... Your future self wants to read today's adventure! 📖🕵️‍♂️",
      "Write now or the diary fairy will tickle your toes! 🧚‍♀️👣",
      "Memory monster is hungry! 🍔 Feed it with your words!",
      "DiaryMe: Where secrets become legends! 🏰💬",
      "A day without a diary entry is like a donut without sprinkles! 🍩✨",
      "Your diary is waving at you! 👋 Write something cute!",
      "Today's story: starring YOU! 🎬 Write it down!",
      "If you don’t write, your diary will start singing karaoke! 🎤😆",
      "DiaryMe: The only place where unicorns keep secrets! 🦄🔒",
      "Your pen is bored. Give it a workout! 🏋️‍♂️🖊️",
      "Warning: Diary may explode from emptiness! 💥📔",
      "Write a memory and earn 1,000 invisible points! 🏆✨",
      "DiaryMe: Where typos are always welcome! 🤪✍️",
      "Your diary just sent a friend request. Accept by writing! 👯‍♂️",
      "Don’t let your thoughts turn into potato chips! 🍟 Write them down!",
      "DiaryMe: The only app that loves your secrets more than you do! ❤️🔐",
      "If you write now, a puppy somewhere will wag its tail! 🐶💖"
    ];

    // Show notification if not written today
    const showCuteNotification = () => {
      if (Notification.permission === 'granted') {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        new Notification('DiaryMe Reminder', {
          body: msg,
          icon: '/favicon.ico',
        });
      }
    };

    // Request permission on login
    if (loggedIn && 'Notification' in window) {
      Notification.requestPermission();
      const lastWritten = localStorage.getItem('diary_last_written');
      const today = getToday();
      // Show notification 30 seconds after login if not written today
      if (lastWritten !== today) {
        setTimeout(showCuteNotification, 30000);
      }
      // Restore recurring reminders every 2 days at 9pm local time
      // ...existing code...
      const schedule9pmReminder = () => {
        const timeoutMs = msUntil9pm();
        setTimeout(() => {
          const lastWritten = localStorage.getItem('diary_last_written');
          const today = new Date().toISOString().slice(0, 10);
          if (lastWritten !== today) {
            showCuteNotification();
          }
          // Schedule next reminder in 2 days
          schedule9pmReminder();
        }, timeoutMs);
      };
      schedule9pmReminder();
    }
  }, [loggedIn]);

  return loggedIn ? (
    <div className="app-container min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 flex flex-col items-center py-4 px-2 relative" style={{maxWidth: '700px', width: '100vw', margin: '0 auto', overflowX: 'hidden', boxSizing: 'border-color'}}>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-full mx-auto px-2 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 z-50 py-4 border-b-4 border-pink-300 shadow-xl rounded-b-3xl" style={{maxWidth: '700px', borderImage: 'linear-gradient(90deg, #f472b6, #60a5fa, #a78bfa) 1', backdropFilter: 'blur(10px)', background: 'linear-gradient(135deg, rgba(252, 231, 243, 0.95), rgba(219, 234, 254, 0.95), rgba(237, 233, 254, 0.95))'}}>
        
        <button
          className="absolute top-3 left-3 bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-pink-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg font-cursive text-sm sm:text-base flex items-center gap-2 transition-all duration-300 transform hover:scale-105 border-2 border-pink-300"
          style={{zIndex: 20}}
          onClick={handleSignOut}
        >
          <span role="img" aria-label="wave">👋</span> 
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </button>
        
        {/* Coffee Button in Header */}
        <div className="absolute top-3 right-3 z-20">
          <a
            href={process.env.REACT_APP_SUPPORT_LINK || "https://hellomydude.gumroad.com/coffee"}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 text-white font-bold p-2 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:rotate-12 border-2 border-yellow-300"
            style={{ 
              boxShadow: '0 6px 20px rgba(255,193,7,0.5)', 
              minWidth: '42px', 
              minHeight: '42px'
            }}
            title="Buy me a coffee ☕"
          >
            <span role="img" aria-label="coffee" className="text-lg group-hover:animate-bounce">
              ☕
            </span>
          </a>
        </div>
        
        <div className="text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 mb-1 font-cursive tracking-wide" style={{wordBreak: 'break-word'}}>
            DiaryMe
          </h1>
          <div className="text-xs text-pink-400 font-cursive">
            Your magical diary space
          </div>
        </div>
  {/* Guide removed as requested */}
        {/* Guide dropdown removed as requested */}
      </header>
      <main className="w-full max-w-full mx-auto flex flex-col gap-4 px-0 sm:px-2" style={{paddingTop: '80px'}}>
        <section className="bg-white/90 rounded-3xl shadow-xl p-4 flex flex-col items-center border-2 border-pink-200 w-full" style={{maxWidth: '100%', boxSizing: 'border-box', padding: '16px'}}>
          <button
            className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 text-white px-4 py-2 rounded-full font-extrabold shadow hover:scale-105 transition-transform duration-200 text-lg font-cursive w-full mb-2"
            onClick={() => setShowEditor(true)}
          >
            + New Diary Entry
          </button>
          {showEditor && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
              <div className="relative bg-white rounded-2xl shadow-xl p-4 w-full mx-auto my-4" style={{maxWidth: '420px', width: '100%', maxHeight: '95vh', overflowY: 'auto'}}>
                <button
                  className="absolute top-2 right-2 bg-red-400 text-white rounded-full px-3 py-1 text-xs font-bold shadow hover:bg-red-500 z-10 font-cursive"
                  onClick={() => setShowEditor(false)}
                  aria-label="Close editor"
                >
                  ×
                </button>
                <DiaryEditor
                  onSave={() => {
                    setShowEditor(false);
                    localStorage.setItem('diary_last_written', new Date().toISOString().slice(0, 10));
                    setTimeout(() => setRefreshList(r => r + 1), 300);
                  }}
                />
              </div>
            </div>
          )}
        </section>
        <section className="bg-white/90 rounded-3xl shadow-xl p-4 border-2 border-blue-200 w-full" style={{maxWidth: '100%', boxSizing: 'border-box', padding: '16px'}}>
          <DiaryList refresh={refreshList} />
        </section>
      </main>
      
      <style>{`
        .font-cursive { font-family: 'Comic Sans MS', 'Comic Sans', cursive; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 480px) {
          .rounded-3xl { border-radius: 1.5rem; }
          .shadow-xl { box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08); }
          .p-4 { padding: 1rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .w-full { width: 100% !important; }
          .max-w-full { max-width: 100vw !important; }
          .flex-col { flex-direction: column !important; }
          .gap-2 { gap: 0.5rem !important; }
          .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
        }
      `}</style>
    </div>
  ) : (
    <>
      <LandingPage onGetStarted={() => setShowAuth(true)} />
      {showAuth && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-4 px-2">
          <div className="w-full" style={{maxWidth: '540px', margin: '0 auto'}}>
            <Auth onAuth={() => setLoggedIn(true)} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;

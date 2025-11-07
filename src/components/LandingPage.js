import React from 'react';

const LandingPage = ({ onGetStarted }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden">
      {/* Floating cute elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-bounce absolute top-20 left-10 text-4xl">🌸</div>
        <div className="animate-pulse absolute top-32 right-20 text-3xl">✨</div>
        <div className="animate-bounce absolute top-64 left-1/4 text-2xl" style={{animationDelay: '1s'}}>🦋</div>
        <div className="animate-pulse absolute bottom-32 right-10 text-4xl" style={{animationDelay: '2s'}}>🌟</div>
        <div className="animate-bounce absolute bottom-20 left-20 text-3xl" style={{animationDelay: '0.5s'}}>🌺</div>
        <div className="animate-pulse absolute top-40 left-1/2 text-2xl" style={{animationDelay: '1.5s'}}>💫</div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Cute header with emojis */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-4xl animate-bounce">📖</span>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight font-cursive">
              DiaryMe
            </h1>
            <span className="text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>💕</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4 font-cursive">
            Your Magical Digital Diary ✨
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-cursive">
            🌸 Write your sweetest thoughts, capture precious memories, and keep your life stories safe 
            <br />
            💖 Beautiful, secure, and syncs across all your devices automatically! 🦋
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 font-cursive border-4 border-white"
            >
              <span className="flex items-center gap-3">
                <span className="group-hover:animate-spin">🚀</span>
                Start Your Diary Journey 
                <span className="group-hover:animate-bounce">💕</span>
              </span>
            </button>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 font-cursive shadow-lg">
              ✨ No credit card • Completely FREE forever! 🎁
            </div>
          </div>
        </div>

        {/* Cute Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-pink-200">
            <div className="text-6xl mb-6 animate-pulse">🔒💕</div>
            <h3 className="text-2xl font-bold mb-4 text-pink-600 font-cursive">Super Safe & Private!</h3>
            <p className="text-gray-700 font-cursive">Your precious thoughts are locked away safely! 🗝️ Only you have the magic key to your diary kingdom! ✨</p>
          </div>
          
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-purple-200">
            <div className="text-6xl mb-6 animate-bounce">📱🌈</div>
            <h3 className="text-2xl font-bold mb-4 text-purple-600 font-cursive">Magical Device Sync!</h3>
            <p className="text-gray-700 font-cursive">Write on your phone, continue on laptop! 🪄 Your diary follows you everywhere like a loyal friend! 🦋</p>
          </div>
          
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-blue-200">
            <div className="text-6xl mb-6 animate-pulse" style={{animationDelay: '0.5s'}}>🎨🌸</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-600 font-cursive">Adorably Beautiful!</h3>
            <p className="text-gray-700 font-cursive">So pretty and fun to use! 🌺 Writing feels like painting with words on a rainbow canvas! 🎭</p>
          </div>
        </div>

        {/* Super Cute Benefits Section */}
        <div className="mt-20 bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-pink-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-cursive mb-4">
              Why DiaryMe is Absolutely Magical! ✨
            </h2>
            <div className="flex justify-center gap-2 text-3xl">
              <span className="animate-bounce">🌟</span>
              <span className="animate-pulse">💫</span>
              <span className="animate-bounce" style={{animationDelay: '0.5s'}}>🌈</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-bounce">🎁</div>
                <div>
                  <h4 className="font-bold text-xl text-pink-600 font-cursive">100% Free Forever!</h4>
                  <p className="text-gray-700 font-cursive">No sneaky fees, no surprise charges! 💕 Write unlimited magical entries forever and ever! ✨</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-pulse">📚</div>
                <div>
                  <h4 className="font-bold text-xl text-purple-600 font-cursive">Export Your Precious Memories!</h4>
                  <p className="text-gray-700 font-cursive">Save your diary as a beautiful PDF or backup file! 📖 Your memories belong to you forever! 💖</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>📅</div>
                <div>
                  <h4 className="font-bold text-xl text-blue-600 font-cursive">Cute Calendar View!</h4>
                  <p className="text-gray-700 font-cursive">See your writing journey like a beautiful rainbow timeline! 🌈 So pretty and inspiring! 🦋</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-pulse" style={{animationDelay: '0.7s'}}>📱</div>
                <div>
                  <h4 className="font-bold text-xl text-pink-600 font-cursive">Works Everywhere!</h4>
                  <p className="text-gray-700 font-cursive">Perfect on phone, tablet, and computer! 🌟 Write anywhere, anytime! Your diary is always with you! 💕</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🔍</div>
                <div>
                  <h4 className="font-bold text-xl text-purple-600 font-cursive">Magic Search Powers!</h4>
                  <p className="text-gray-700 font-cursive">Find any memory instantly! 🪄 Like having a crystal ball for your thoughts! ✨</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-3xl animate-pulse" style={{animationDelay: '0.9s'}}>🌐</div>
                <div>
                  <h4 className="font-bold text-xl text-blue-600 font-cursive">Always There for You!</h4>
                  <p className="text-gray-700 font-cursive">Write offline, sync online! 🌙 Never lose a precious thought! Your diary guardian angel! 👼</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cute SEO Content Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-8 rounded-3xl border-4 border-purple-200">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 text-center font-cursive">
            🌟 The Most Adorable Free Digital Diary for 2025! 💖
          </h2>
          <div className="text-gray-700 space-y-4 text-lg leading-relaxed font-cursive text-center">
            <p className="text-xl">
              Looking for a <strong className="text-pink-600">free online diary</strong> that keeps your precious memories safe? 🌸 
              DiaryMe is the most magical <strong className="text-purple-600">digital journal app</strong> for documenting 
              your beautiful life journey! ✨
            </p>
            <p>
              Our adorable <strong className="text-blue-600">personal diary app</strong> gives you everything: 
              secure cloud storage 🔒, automatic device sync 🌈, gorgeous design 🎨, PDF export 📚, 
              and calendar views 📅. Perfect for <strong className="text-pink-600">daily journaling</strong>, 
              recording precious milestones, or mental wellness through writing! 🦋
            </p>
          </div>
        </div>

        {/* Final Magical CTA */}
        <div className="mt-20 text-center relative">
          {/* Floating sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="animate-ping absolute top-10 left-1/4 text-2xl">✨</div>
            <div className="animate-bounce absolute top-6 right-1/3 text-xl">🌟</div>
            <div className="animate-pulse absolute bottom-8 left-1/3 text-2xl">💫</div>
            <div className="animate-ping absolute bottom-12 right-1/4 text-xl" style={{animationDelay: '1s'}}>⭐</div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-gray-700 mb-6 font-cursive">
              Ready to Start Your Magical Journey? 🚀✨
            </h3>
            
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-16 py-8 rounded-full text-2xl font-bold transition-all duration-500 shadow-2xl hover:shadow-pink-300 transform hover:scale-110 hover:-translate-y-2 font-cursive border-4 border-white relative overflow-hidden"
            >
              {/* Sparkle effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="flex items-center gap-4 relative z-10">
                <span className="text-3xl group-hover:animate-spin">📖</span>
                Begin Your Diary Adventure
                <span className="text-3xl group-hover:animate-bounce">💕</span>
              </span>
            </button>
            
            <div className="mt-6 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full inline-block shadow-xl border-2 border-pink-200">
              <p className="text-gray-600 font-cursive text-lg">
                🎁 <strong>Completely FREE</strong> • 🔒 <strong>Super Safe</strong> • 🌈 <strong>Unlimited Fun</strong> 
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Join <strong className="text-pink-600">10,000+</strong> happy diary writers! 📝💖
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cute CSS Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap');
        
        .font-cursive { 
          font-family: 'Comic Neue', 'Comic Sans MS', cursive; 
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        /* Cute hover effects */
        .group:hover .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .group:hover .animate-bounce {
          animation: bounce 0.5s ease-in-out infinite;
        }
        
        /* Background sparkle animation */
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
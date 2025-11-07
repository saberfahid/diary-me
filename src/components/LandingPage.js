import React from 'react';

const LandingPage = ({ onGetStarted }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal <span className="text-indigo-600">Digital Diary</span>
            <br />
            <span className="text-purple-600">Free Forever</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Write your daily thoughts, capture memories, and keep your life stories safe. 
            Beautiful, secure, and syncs across all your devices automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={onGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              🚀 Start Writing Your Diary - Free!
            </button>
            <div className="text-sm text-gray-500">No credit card required</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">100% Private & Secure</h3>
            <p className="text-gray-600">Your diary entries are encrypted and stored securely. Only you can access your personal thoughts and memories.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Cross-Device Sync</h3>
            <p className="text-gray-600">Write on your phone, continue on your laptop. Your diary automatically syncs across all your devices in real-time.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Beautiful Interface</h3>
            <p className="text-gray-600">Clean, distraction-free design that makes writing a joy. Focus on your thoughts, not on complicated features.</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose DiaryMe for Your Personal Journal?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Free Online Diary</h4>
                  <p className="text-gray-600">No subscription fees, no hidden costs. Write unlimited entries forever.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Export Your Data</h4>
                  <p className="text-gray-600">Download your diary as PDF or JSON anytime. Your data belongs to you.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Calendar View</h4>
                  <p className="text-gray-600">See your writing journey with our beautiful calendar interface.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Mobile Responsive</h4>
                  <p className="text-gray-600">Perfect experience on phones, tablets, and computers.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Instant Search</h4>
                  <p className="text-gray-600">Find any memory or thought instantly with powerful search.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Always Available</h4>
                  <p className="text-gray-600">Write offline, sync when online. Never lose a thought.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 prose max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Best Free Digital Diary App for 2025</h2>
          <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
            <p>
              Looking for a <strong>free online diary</strong> that keeps your memories safe? DiaryMe is the perfect 
              <strong> digital journal app</strong> for anyone who wants to document their daily life, thoughts, 
              and experiences without any cost or complexity.
            </p>
            <p>
              Our <strong>personal diary app</strong> offers everything you need: secure cloud storage, 
              automatic sync across devices, beautiful design, and powerful features like PDF export 
              and calendar views. Whether you're keeping a <strong>daily journal</strong>, recording 
              life milestones, or simply wanting to improve your mental health through writing, 
              DiaryMe makes it easy and enjoyable.
            </p>
            <p>
              Start your <strong>online journaling</strong> journey today with DiaryMe - the most 
              trusted <strong>free diary app</strong> that respects your privacy and helps you 
              preserve your memories for years to come.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 rounded-xl text-xl font-semibold transition-all shadow-2xl transform hover:scale-105"
          >
            📝 Begin Your Diary Journey - 100% Free
          </button>
          <p className="mt-4 text-gray-500">Join thousands of people preserving their memories with DiaryMe</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
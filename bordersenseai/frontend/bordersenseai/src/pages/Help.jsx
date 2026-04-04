export default function Help() {
  const faqs = [
    {
      question: "How do I report an incident?",
      answer: "Use the Incident Report form in the Dashboard or navigate to the Reports section. Fill in the required details and submit."
    },
    {
      question: "How do I assign a patrol route?",
      answer: "Go to Patrol Planner in the sidebar, create or select a route, and assign available officers from the dropdown."
    },
    {
      question: "What do the alert severity levels mean?",
      answer: "Critical: Immediate response required. High: Urgent attention needed. Medium: Standard priority. Low: Routine monitoring."
    },
    {
      question: "How do I provide feedback on AI detections?",
      answer: "Select any alert from the Alerts list and use the Feedback form to rate accuracy and provide corrections."
    },
    {
      question: "Can I customize the dashboard view?",
      answer: "Yes, use the Settings page to adjust display preferences, notification settings, and map styles."
    },
  ];

  const resources = [
    { title: "User Manual", desc: "Complete guide to all features", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { title: "Video Tutorials", desc: "Step-by-step video guides", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { title: "API Documentation", desc: "Developer resources", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { title: "Support Contact", desc: "Get help from our team", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Help Center</h1>
        <p className="text-slate-400">Find answers and resources to help you use BorderSense AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource, idx) => (
          <div key={idx} className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={resource.icon} />
              </svg>
            </div>
            <h3 className="text-white font-medium">{resource.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{resource.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-slate-700/50">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-800/30 transition-colors">
              <h3 className="text-white font-medium mb-2">{faq.question}</h3>
              <p className="text-slate-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium">Still need help?</h3>
            <p className="text-slate-400 text-sm mt-1">Can't find what you're looking for? Our support team is available 24/7.</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
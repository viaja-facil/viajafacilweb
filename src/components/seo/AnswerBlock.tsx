interface AnswerBlockProps {
  title: string;
  answer: string;
  stats?: Array<{ value: string; label: string }>;
}

export default function AnswerBlock({ title, answer, stats }: AnswerBlockProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: answer,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".answer-text"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-gradient-to-r from-[#f97316]/5 to-[#ea580c]/5 rounded-2xl p-6 border border-[#f97316]/10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-700 leading-relaxed answer-text">{answer}</p>
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-3 bg-white rounded-xl border border-gray-100">
                <span className="text-xl font-bold text-[#f97316]">{stat.value}</span>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

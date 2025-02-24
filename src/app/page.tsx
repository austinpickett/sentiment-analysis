"use client";

import { AlertCircle, Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState<{
    label: string;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSentiment(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setSentiment(data);
    } catch (err) {
      console.log(err);
      setError("Failed to analyze text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: string | undefined) => {
    if (!score) return "bg-gray-100";
    const scoreNum = parseFloat(score[0]);
    if (scoreNum >= 4) return "bg-green-100 text-green-800";
    if (scoreNum >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getSentimentIcon = (score: string | undefined) => {
    if (!score) return null;
    const scoreNum = parseFloat(score[0]);
    return scoreNum >= 3 ? (
      <ThumbsUp className="w-5 h-5" />
    ) : (
      <ThumbsDown className="w-5 h-5" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sentiment Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Enter your text below to analyze its sentiment
          </p>
        </div>

        <form onSubmit={analyzeSentiment} className="space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here... (maximum ~2000 characters)"
              className={`w-full h-40 px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition duration-200 ease-in-out resize-none text-black
                        ${text.length > 2000 ? "border-yellow-400" : ""}`}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
              {text.length} / 2000 characters
              {text.length > 2000 && (
                <span className="text-yellow-600 ml-2">
                  (Text will be truncated)
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full flex items-center justify-center px-4 py-3 
                     bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition duration-200 ease-in-out"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Analyze Sentiment"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {sentiment && !error && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <div
              className={`p-6 rounded-lg ${getSentimentColor(
                sentiment?.label
              )} flex items-center justify-between`}
            >
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Sentiment Score: {sentiment?.label}
                </h3>
                <p className="text-sm opacity-75">
                  Confidence: {(sentiment?.score * 100).toFixed(1)}%
                </p>
              </div>
              {getSentimentIcon(sentiment?.label)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/artfit_logo.png";

const developerCategories = [
  {
    title: "Languages",
    tags: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Ruby", "PHP", "Swift"],
  },
  {
    title: "Frameworks / Libraries",
    tags: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask"],
  },
  {
    title: "Tools / IDEs",
    tags: ["VSCode", "WebStorm", "IntelliJ IDEA", "Git", "GitHub", "Docker", "Kubernetes", "npm/yarn"],
  },
  {
    title: "Databases",
    tags: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "SQLite", "Redis", "Cassandra", "Elasticsearch"],
  },
  {
    title: "Cloud Services",
    tags: ["AWS", "Azure", "Google Cloud", "Heroku", "Netlify", "Vercel", "DigitalOcean", "Linode"],
  },
];

const DeveloperSkills: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const location = useLocation();
  const isBothFlow = location.state?.role === "BOTH";

  function toggleSkill(skill: string) {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
      {/* Top-left logo */}
      <div className="flex items-center space-x-2 mb-8">
        <img src={logo} alt="ArtFit Logo" className="w-12 h-12 object-contain" />
        <span className="text-2xl font-bold text-gray-900">ArtFit</span>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center flex-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Select Your Developer Skills
        </h2>

        <div className="w-full max-w-4xl space-y-10">
          {developerCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{category.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.tags.map((tag) => {
                  const active = selected.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleSkill(tag)}
                      className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Nav button */}
        <div className="mt-12">
          {isBothFlow ? (
            <Link
              to="/designskills"
              state={{ role: "BOTH" }}
              className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Next
            </Link>
          ) : (
            <Link
              to="/continue"
              className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Continue
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperSkills;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/artfit_logo.png";

const categories = [
  {
    title: "Roles / Disciplines",
    tags: [
      "UI Designer", "UX Designer", "Graphic Designer", "Product Designer",
      "Web Designer", "Motion Designer", "Game Designer", "Industrial Designer",
      "Interior Designer", "Fashion Designer", "Brand / Identity Designer",
      "Illustrator", "Creative Director", "Visual Designer",
    ],
  },
  {
    title: "Styles / Aesthetics",
    tags: [
      "Minimalist", "Modern", "Futuristic", "Flat Design", "Skeuomorphic",
      "Corporate / Professional", "Playful / Whimsical", "Hand-Drawn / Sketch",
      "Geometric", "Abstract", "Realistic", "Vintage / Retro", "Experimental",
    ],
  },
  {
    title: "Tools / Software",
    tags: [
      "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD",
      "Adobe After Effects", "Sketch", "InVision", "Blender", "Cinema4D",
      "Procreate", "CorelDRAW", "Canva", "AutoCAD / Rhino / SolidWorks",
    ],
  },
  {
    title: "Mediums / Outputs",
    tags: [
      "Mobile Apps", "Websites", "Branding / Logo", "Print / Posters", "Packaging",
      "Motion Graphics", "3D Models", "Concept Art", "Illustration", "Typography",
      "Architecture / Interior", "Fashion Apparel", "Product Mockups",
    ],
  },
  {
    title: "Interests / Focus Areas",
    tags: [
      "Accessibility", "AR / VR", "AI-assisted Design", "Design Systems", "Gaming UI",
      "E-commerce", "SaaS Platforms", "Social Media Content", "Storyboarding",
      "Data Visualization", "Environmental / Sustainable Design",
    ],
  },
];

const DesignSkills: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
      {/* Top-left logo */}
      <div className="flex items-center space-x-2 mb-8">
        <img src={logo} alt="ArtFit Logo" className="w-12 h-12 object-contain" />
        <span className="text-2xl font-bold text-gray-900">ArtFit</span>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center flex-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Select Your Design Skills</h2>

        <div className="w-full max-w-4xl space-y-10">
          {categories.map((category) => (
            <div key={category.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{category.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.tags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(tag)}
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

        {/* Continue */}
        <div className="mt-12">
          <Link
            to="/continue"
            className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesignSkills;

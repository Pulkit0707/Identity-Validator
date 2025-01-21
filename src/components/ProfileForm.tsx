import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Github, Linkedin, FileText, Mail, Share2 } from 'lucide-react';
import type { Profile, CodingProfile, WorkExperience, Project } from '../types';
import { analyzeProfile, generateResume, generateColdEmail } from '../services/ai';

export default function ProfileForm() {
  const [profile, setProfile] = useState<Partial<Profile>>({
    codingProfiles: [],
    workExperience: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [resume, setResume] = useState('');
  const [coldEmail, setColdEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [badgeUrl, setBadgeUrl] = useState<string>('');

  const addCodingProfile = () => {
    setProfile(prev => ({
      ...prev,
      codingProfiles: [...(prev.codingProfiles || []), { platform: '', username: '', url: '' }]
    }));
  };

  const addWorkExperience = () => {
    setProfile(prev => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...(prev.projects || []), {
        title: '',
        description: '',
        technologies: [],
        url: ''
      }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await analyzeProfile(profile as Profile);
      setAnalysis(result.text);
      setRating(result.rating);
      setBadgeUrl(result.badgeUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze profile. Please check your Cohere API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    setLoading(true);
    try {
      const resumeContent = await generateResume(profile as Profile);
      setResume(resumeContent);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume. Please check your Cohere API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateColdEmail = async () => {
    setLoading(true);
    try {
      const emailContent = await generateColdEmail(profile as Profile);
      setColdEmail(emailContent);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate cold email. Please check your Cohere API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (badgeUrl) {
      try {
        await navigator.share({
          title: 'My Profile Rating',
          text: `Check out my profile rating: ${rating}/100!`,
          url: badgeUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback for browsers that don't support sharing
        window.open(badgeUrl, '_blank');
      }
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Github className="w-6 h-6" />
            Coding Profiles
          </h2>
          {profile.codingProfiles?.map((profile, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Platform"
                className="flex-1 rounded-lg border p-2"
                value={profile.platform}
                onChange={e => {
                  const newProfiles = [...(profile.codingProfiles || [])];
                  newProfiles[index].platform = e.target.value;
                  setProfile(prev => ({ ...prev, codingProfiles: newProfiles }));
                }}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 rounded-lg border p-2"
                value={profile.username}
                onChange={e => {
                  const newProfiles = [...(profile.codingProfiles || [])];
                  newProfiles[index].username = e.target.value;
                  setProfile(prev => ({ ...prev, codingProfiles: newProfiles }));
                }}
              />
              <input
                type="url"
                placeholder="Profile URL"
                className="flex-1 rounded-lg border p-2"
                value={profile.url}
                onChange={e => {
                  const newProfiles = [...(profile.codingProfiles || [])];
                  newProfiles[index].url = e.target.value;
                  setProfile(prev => ({ ...prev, codingProfiles: newProfiles }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newProfiles = [...(profile.codingProfiles || [])];
                  newProfiles.splice(index, 1);
                  setProfile(prev => ({ ...prev, codingProfiles: newProfiles }));
                }}
                className="text-red-500"
              >
                <MinusCircle />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCodingProfile}
            className="flex items-center gap-2 text-blue-600"
          >
            <PlusCircle /> Add Coding Profile
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Linkedin className="w-6 h-6" />
            LinkedIn Profile
          </h2>
          <input
            type="url"
            placeholder="LinkedIn URL"
            className="w-full rounded-lg border p-2"
            value={profile.linkedinUrl}
            onChange={e => setProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Work Experience
          </h2>
          {profile.workExperience?.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  className="rounded-lg border p-2"
                  value={exp.company}
                  onChange={e => {
                    const newExp = [...(profile.workExperience || [])];
                    newExp[index].company = e.target.value;
                    setProfile(prev => ({ ...prev, workExperience: newExp }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Role"
                  className="rounded-lg border p-2"
                  value={exp.role}
                  onChange={e => {
                    const newExp = [...(profile.workExperience || [])];
                    newExp[index].role = e.target.value;
                    setProfile(prev => ({ ...prev, workExperience: newExp }));
                  }}
                />
                <input
                  type="date"
                  placeholder="Start Date"
                  className="rounded-lg border p-2"
                  value={exp.startDate}
                  onChange={e => {
                    const newExp = [...(profile.workExperience || [])];
                    newExp[index].startDate = e.target.value;
                    setProfile(prev => ({ ...prev, workExperience: newExp }));
                  }}
                />
                <input
                  type="date"
                  placeholder="End Date"
                  className="rounded-lg border p-2"
                  value={exp.endDate}
                  onChange={e => {
                    const newExp = [...(profile.workExperience || [])];
                    newExp[index].endDate = e.target.value;
                    setProfile(prev => ({ ...prev, workExperience: newExp }));
                  }}
                />
              </div>
              <textarea
                placeholder="Description"
                className="w-full rounded-lg border p-2"
                value={exp.description}
                onChange={e => {
                  const newExp = [...(profile.workExperience || [])];
                  newExp[index].description = e.target.value;
                  setProfile(prev => ({ ...prev, workExperience: newExp }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newExp = [...(profile.workExperience || [])];
                  newExp.splice(index, 1);
                  setProfile(prev => ({ ...prev, workExperience: newExp }));
                }}
                className="text-red-500 flex items-center gap-2"
              >
                <MinusCircle /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWorkExperience}
            className="flex items-center gap-2 text-blue-600"
          >
            <PlusCircle /> Add Work Experience
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Projects
          </h2>
          {profile.projects?.map((project, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Project Title"
                className="w-full rounded-lg border p-2"
                value={project.title}
                onChange={e => {
                  const newProjects = [...(profile.projects || [])];
                  newProjects[index].title = e.target.value;
                  setProfile(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <textarea
                placeholder="Project Description"
                className="w-full rounded-lg border p-2"
                value={project.description}
                onChange={e => {
                  const newProjects = [...(profile.projects || [])];
                  newProjects[index].description = e.target.value;
                  setProfile(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                className="w-full rounded-lg border p-2"
                value={project.technologies.join(', ')}
                onChange={e => {
                  const newProjects = [...(profile.projects || [])];
                  newProjects[index].technologies = e.target.value.split(',').map(t => t.trim());
                  setProfile(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <input
                type="url"
                placeholder="Project URL"
                className="w-full rounded-lg border p-2"
                value={project.url}
                onChange={e => {
                  const newProjects = [...(profile.projects || [])];
                  newProjects[index].url = e.target.value;
                  setProfile(prev => ({ ...prev, projects: newProjects }));
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newProjects = [...(profile.projects || [])];
                  newProjects.splice(index, 1);
                  setProfile(prev => ({ ...prev, projects: newProjects }));
                }}
                className="text-red-500 flex items-center gap-2"
              >
                <MinusCircle /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 text-blue-600"
          >
            <PlusCircle /> Add Project
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Profile Analysis'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateResume}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" /> Generate Resume
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateColdEmail}
            className="flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4" /> Generate Cold Email
          </button>
        </div>
      </form>

      {analysis && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Profile Analysis</h3>
            {rating > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-600">{rating}/100</span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Share2 className="w-4 h-4" /> Share Badge
                </button>
              </div>
            )}
          </div>
          {badgeUrl && (
            <div className="flex justify-center">
              <img
                src={badgeUrl}
                alt={`Profile Rating: ${rating}/100`}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="prose max-w-none">{analysis}</div>
        </div>
      )}

      {resume && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Generated Resume</h3>
          <div className="prose max-w-none whitespace-pre-wrap">{resume}</div>
        </div>
      )}

      {coldEmail && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Cold Email Template</h3>
          <div className="prose max-w-none whitespace-pre-wrap">{coldEmail}</div>
        </div>
      )}
    </div>
  );
}
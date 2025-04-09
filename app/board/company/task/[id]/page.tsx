'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

// Helper function to get color class
const getColorClass = (category: string) => {
  const colors: { [key: string]: string } = {
    Finances: "text-emerald-500",
    Marketing: "text-blue-500",
    Design: "text-purple-500",
    Building: "text-orange-500",
    Research: "text-cyan-500",
    Product: "text-indigo-500",
    HR: "text-pink-500",
    "Project Management": "text-amber-500",
    Others: "text-gray-500"
  };
  return colors[category] || "text-gray-500";
};

const TaskPage = () => {
  const params = useParams();
  const taskId = params.id as Id<"tasks">;
  const task = useQuery(api.companies.getTask, { taskId });
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form inputs
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Mutations
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createSubmission = useMutation(api.submissions.createSubmission);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setSubmitError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setSubmitError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('You must be logged in to submit');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let fileId: string | undefined;
      let fileName: string | undefined;

      // Upload file if present
      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        
        if (!result.ok) {
          throw new Error('Failed to upload file');
        }
        
        fileId = await result.text();
        fileName = selectedFile.name;
      }

      // Create submission
      await createSubmission({
        taskId,
        userId: user.id,
        text: submissionText,
        url: submissionUrl || undefined,
        fileId,
        fileName,
      });

      // Reset form
      setSubmissionText('');
      setSubmissionUrl('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setSubmitError('Failed to submit. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  // Format reward display
  const getRewardDisplay = () => {
    if (!task.reward) return "No reward specified";
    if (typeof task.reward === 'number') {
      return `${task.reward} points`;
    }
    const { type, details } = task.reward;
    return (
      <>
        <span className="font-semibold">{type}</span>
        <br />
        {details.amount} {details.currency}
        {details.description && (
          <span className="block text-sm text-gray-400">{details.description}</span>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Company Header */}
        {task.company && (
          <div className="flex items-center space-x-3 mb-8">
            <Image
              src={task.company.image}
              alt={task.company.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-gray-400">{task.company.name}</span>
          </div>
        )}

        {/* Task Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`text-sm font-medium ${getColorClass(task.category)}`}>
              {task.category}
            </span>
            {task.forRole && (
              <span className="text-sm text-gray-400">• {task.forRole}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-4">{task.name || task.text}</h1>
          
          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-400 text-lg">{task.description}</p>
            </div>
          )}

          {/* Reward */}
          <div className="mb-6 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-2">Reward</h2>
            <div className="text-gray-400">
              {getRewardDisplay()}
            </div>
          </div>

          {/* Status */}
          <div className="mb-6 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
              {task.status}
            </span>
          </div>
        </div>

        {/* Instructions */}
        {(task as any).instructions && (
          <div className="mb-8 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <p className="text-gray-400">{(task as any).instructions}</p>
          </div>
        )}

        {/* Explanation */}
        {task.explanation && (
          <div className="mb-8 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-2">Why This Matters</h2>
            <p className="text-gray-400">{task.explanation}</p>
          </div>
        )}

        {/* Additional Info */}
        {task.additionalInfo && (
          <div className="mb-8 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
            <p className="text-gray-400">{task.additionalInfo}</p>
          </div>
        )}

        {/* Checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mb-8 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-4">Checklist</h2>
            <div className="space-y-3">
              {task.checklist.map((item: { id: string; text: string; completed: boolean }) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded border ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'} mt-0.5`}>
                    {item.completed && (
                      <svg className="w-4 h-4 mx-auto mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Solution */}
        <div className="mb-8 border-t border-gray-800 pt-6">
          <h2 className="text-xl font-semibold mb-4">Submit</h2>
          {!user ? (
            <div className="text-gray-400">
              Please sign in to submit your solution.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Input */}
              <div>
                <label htmlFor="submissionText" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="submissionText"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Describe your solution or add any relevant notes..."
                  required
                  className="w-full h-32 bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* URL Input */}
              <div>
                <label htmlFor="submissionUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  URL (Optional)
                </label>
                <input
                  type="url"
                  id="submissionUrl"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="Add a relevant URL (e.g., GitHub repository, demo link)"
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="submissionFile" className="block text-sm font-medium text-gray-300 mb-2">
                  Attachment (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="submissionFile"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar,.7z,.png,.jpg,.jpeg"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Choose File
                  </button>
                  <span className="text-sm text-gray-400">
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Max file size: 10MB. Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR, 7Z, PNG, JPG, JPEG
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="text-red-500 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isSubmitting 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskPage
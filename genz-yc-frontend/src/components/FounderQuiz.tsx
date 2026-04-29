import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/FounderQuiz.css';

interface QuizResponse {
  problemStatement: string;
  whyYou: string;
  unfairAdvantage: string;
  buildApproach: 'fast' | 'perfect';
  equitySplit: 'equal' | 'merit' | 'flexible' | 'uncertain';
  riskTolerance: number; // 1-10 scale
  startupsInterested: string[];
}

const FounderQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<QuizResponse>({
    problemStatement: '',
    whyYou: '',
    unfairAdvantage: '',
    buildApproach: 'fast',
    equitySplit: 'equal',
    riskTolerance: 5,
    startupsInterested: [],
  });

  const startupCategories = ['AI', 'SaaS', 'D2C', 'Fintech', 'Hardware', 'Climate', 'HealthTech'];

  const questions = [
    {
      id: 'problemStatement',
      title: 'What problem would you work on for the next 5 years?',
      subtitle: 'Describe a problem you\'re deeply passionate about solving',
      type: 'textarea',
      placeholder: 'Your answer...',
    },
    {
      id: 'whyYou',
      title: 'Why are you the right person to solve this?',
      subtitle: 'What unique perspective or experience do you bring?',
      type: 'textarea',
      placeholder: 'Your answer...',
    },
    {
      id: 'unfairAdvantage',
      title: 'What is your unfair advantage?',
      subtitle: 'Network, skills, domain expertise, or something else?',
      type: 'textarea',
      placeholder: 'Your answer...',
    },
    {
      id: 'buildApproach',
      title: 'Do you prefer to build fast or build perfectly first?',
      subtitle: 'Choose your founding philosophy',
      type: 'choice',
      options: [
        { value: 'fast', label: '⚡ Build Fast', description: 'Speed > Perfection' },
        { value: 'perfect', label: '💎 Build Perfect', description: 'Quality > Speed' },
      ],
    },
    {
      id: 'equitySplit',
      title: 'How do you view equity split with co-founders?',
      subtitle: 'What feels fair to you?',
      type: 'choice',
      options: [
        { value: 'equal', label: '⚖️ Equal Split', description: 'Everyone gets equal' },
        { value: 'merit', label: '📊 Merit-Based', description: 'Based on contribution' },
        { value: 'flexible', label: '🤝 Flexible', description: 'Depends on arrangement' },
        { value: 'uncertain', label: '❓ Uncertain', description: 'Not sure yet' },
      ],
    },
    {
      id: 'riskTolerance',
      title: 'What is your risk tolerance level?',
      subtitle: 'How comfortable are you with uncertainty?',
      type: 'slider',
      min: 1,
      max: 10,
      labels: ['Very Risk-Averse', 'Highly Risk-Seeking'],
    },
    {
      id: 'startupsInterested',
      title: 'Which startup spaces interest you most?',
      subtitle: 'Select all that apply',
      type: 'checkbox',
      options: startupCategories,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleChoice = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value,
    }));
    setError('');
  };

  const handleSliderChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      riskTolerance: value,
    }));
    setError('');
  };

  const handleCheckboxChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      startupsInterested: prev.startupsInterested.includes(category)
        ? prev.startupsInterested.filter(c => c !== category)
        : [...prev.startupsInterested, category],
    }));
    setError('');
  };

  const isCurrentStepValid = () => {
    const currentQuestion = questions[currentStep];
    const fieldValue = formData[currentQuestion.id as keyof QuizResponse];

    if (currentQuestion.type === 'textarea') {
      return (fieldValue as string).trim().length > 10;
    }
    if (currentQuestion.type === 'checkbox') {
      return (fieldValue as string[]).length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      setError('Please complete this question before proceeding');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setTimeout(() => navigate('/auth'), 2000);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quiz');
      }

      setSuccess(true);
      localStorage.setItem('quizCompleted', 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="founder-quiz-container">
      <div className="quiz-background">
        <div className="gradient-blur blur-1"></div>
        <div className="gradient-blur blur-2"></div>
      </div>

      <motion.div
        className="quiz-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="quiz-header">
          <motion.h1
            className="quiz-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Founder Compatibility Quiz
          </motion.h1>
          <motion.p
            className="quiz-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Let's understand your founder DNA and find your perfect co-founder match
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar-background">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="progress-text">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="question-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="question-title">{currentQuestion.title}</h2>
            <p className="question-subtitle">{currentQuestion.subtitle}</p>

            <div className="question-content">
              {/* Textarea Questions */}
              {currentQuestion.type === 'textarea' && (
                <textarea
                  name={currentQuestion.id}
                  value={formData[currentQuestion.id as keyof QuizResponse] as string}
                  onChange={handleInputChange}
                  placeholder={currentQuestion.placeholder}
                  className="quiz-textarea"
                  rows={5}
                />
              )}

              {/* Choice Questions (Multiple options) */}
              {currentQuestion.type === 'choice' && (
                <div className="choice-grid">
                  {currentQuestion.options?.map((option: any) => (
                    <motion.button
                      key={option.value}
                      className={`choice-button ${
                        formData[currentQuestion.id as keyof QuizResponse] === option.value
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleChoice(currentQuestion.id, option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="choice-label">{option.label}</span>
                      <span className="choice-description">{option.description}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Slider Question */}
              {currentQuestion.type === 'slider' && (
                <div className="slider-section">
                  <div className="slider-container">
                    <input
                      type="range"
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      value={formData.riskTolerance}
                      onChange={e => handleSliderChange(Number(e.target.value))}
                      className="quiz-slider"
                    />
                  </div>
                  <div className="slider-labels">
                    <span className="slider-label-left">{currentQuestion.labels?.[0]}</span>
                    <span className="slider-value">{formData.riskTolerance}/10</span>
                    <span className="slider-label-right">{currentQuestion.labels?.[1]}</span>
                  </div>
                </div>
              )}

              {/* Checkbox Questions */}
              {currentQuestion.type === 'checkbox' && (
                <div className="checkbox-grid">
                  {(currentQuestion.options as string[])?.map((option: string) => (
                    <motion.label
                      key={option}
                      className={`checkbox-item ${
                        formData.startupsInterested.includes(option) ? 'checked' : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.startupsInterested.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-label">{option}</span>
                    </motion.label>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle size={18} />
                <span>Quiz submitted successfully! Redirecting to dashboard...</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <motion.button
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            whileHover={{ scale: currentStep > 0 ? 1.05 : 1 }}
            whileTap={{ scale: currentStep > 0 ? 0.95 : 1 }}
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          <motion.button
            className={`nav-button next-button ${loading ? 'loading' : ''}`}
            onClick={handleNext}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <motion.div
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ) : (
              <>
                {currentStep === questions.length - 1 ? 'Complete Quiz' : 'Next'}
                {currentStep < questions.length - 1 && <ChevronRight size={20} />}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FounderQuiz;

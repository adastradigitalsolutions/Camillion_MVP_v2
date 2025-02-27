import React, { useState } from 'react';
import { Calendar, CheckCircle, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  videoUrl: string;
  description: string;
  ptNotes?: string;
  userNotes?: string;
}

interface TrainingProgram {
  name: string;
  exercises: Exercise[];
}

const trainingPrograms: TrainingProgram[] = [
  {
    name: 'Training A',
    exercises: [
      {
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        rest: '90s',
        tempo: '2-1-2',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        description: 'Perform with controlled movement, focusing on chest contraction.',
        ptNotes: 'Keep your shoulders back and down throughout the movement. Focus on driving through your chest, not your shoulders.',
        userNotes: ''
      },
      {
        name: 'Squats',
        sets: 4,
        reps: '8-12',
        rest: '120s',
        tempo: '2-1-2',
        videoUrl: 'https://www.youtube.com/embed/gsNoPYwWXeM',
        description: 'Keep your back straight and go as low as your mobility allows.',
        ptNotes: 'Remember to keep your core tight and maintain a neutral spine. Drive through your heels.',
        userNotes: ''
      }
    ]
  },
  {
    name: 'Training B',
    exercises: [
      {
        name: 'Pull-ups',
        sets: 4,
        reps: '6-8',
        rest: '90s',
        tempo: '2-1-2',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        description: 'Focus on full range of motion and controlled descent.',
        ptNotes: 'Initiate the movement by pulling your shoulder blades down. Keep your core engaged throughout.',
        userNotes: ''
      }
    ]
  }
];

// Fixed training dates for the example
const completedTrainingDates = [
  '2024-03-05',
  '2024-03-07',
  '2024-03-12',
  '2024-03-14',
  '2024-03-19',
  '2024-03-21'
];

const Training = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseNotes, setExerciseNotes] = useState<{ [key: string]: string }>({});

  // Generate calendar days for the current week
  const generateWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays(selectedDate);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const isTrainingCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedTrainingDates.includes(dateString);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleStartTraining = () => {
    setShowTrainingModal(true);
  };

  const handleSelectProgram = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setCurrentExerciseIndex(0);
    setShowTrainingModal(false);
    setShowExerciseModal(true);
  };

  const handleNextExercise = () => {
    if (selectedProgram && currentExerciseIndex < selectedProgram.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowExerciseModal(false);
      // Here you would typically save the completed workout
      const today = new Date().toISOString().split('T')[0];
      if (!completedTrainingDates.includes(today)) {
        completedTrainingDates.push(today);
      }
    }
  };

  const handleViewExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleUpdateNotes = (exerciseId: string, notes: string) => {
    setExerciseNotes(prev => ({
      ...prev,
      [exerciseId]: notes
    }));
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Your Training</h1>
        
        {/* Calendar Strip */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePreviousWeek} className="p-2">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
            </h2>
            <button onClick={handleNextWeek} className="p-2">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-[--primary] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xs">{formatDate(date)}</span>
                <span className="text-lg font-bold">{date.getDate()}</span>
                {isTrainingCompleted(date) && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4">
          <button
            onClick={handleStartTraining}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Train Now
          </button>
          <button
            onClick={() => setShowProgramModal(true)}
            className="bg-white text-[--primary] border-2 border-[--primary] font-semibold py-2 px-6 rounded-lg 
              transform transition-all duration-200 hover:bg-[--primary] hover:text-white"
          >
            View My Program
          </button>
        </div>
      </div>

      {/* Training Selection Modal */}
      <AnimatePresence>
        {showTrainingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Select Training</h2>
                <button
                  onClick={() => setShowTrainingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {trainingPrograms.map((program, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectProgram(program)}
                    className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-left"
                  >
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {program.exercises.length} exercises
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Modal */}
      <AnimatePresence>
        {showExerciseModal && selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedProgram.exercises[currentExerciseIndex].name}
                </h2>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6">
                <iframe
                  src={selectedProgram.exercises[currentExerciseIndex].videoUrl}
                  title={selectedProgram.exercises[currentExerciseIndex].name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sets</p>
                  <p className="text-lg font-bold">
                    {selectedProgram.exercises[currentExerciseIndex].sets}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Reps</p>
                  <p className="text-lg font-bold">
                    {selectedProgram.exercises[currentExerciseIndex].reps}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rest</p>
                  <p className="text-lg font-bold">
                    {selectedProgram.exercises[currentExerciseIndex].rest}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tempo</p>
                  <p className="text-lg font-bold">
                    {selectedProgram.exercises[currentExerciseIndex].tempo}
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Notes from PT</h3>
                  <p className="text-gray-600">
                    {selectedProgram.exercises[currentExerciseIndex].ptNotes}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">My Notes</h3>
                  <textarea
                    value={exerciseNotes[selectedProgram.exercises[currentExerciseIndex].name] || ''}
                    onChange={(e) => handleUpdateNotes(
                      selectedProgram.exercises[currentExerciseIndex].name,
                      e.target.value
                    )}
                    placeholder="Add your notes here..."
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none"
                    rows={3}
                  />
                </div>
              </div>
              <button
                onClick={handleNextExercise}
                className="btn-primary w-full"
              >
                {currentExerciseIndex === selectedProgram.exercises.length - 1
                  ? 'Complete Workout'
                  : 'Next Exercise'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Program View Modal */}
      <AnimatePresence>
        {showProgramModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Program</h2>
                <button
                  onClick={() => setShowProgramModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                {trainingPrograms.map((program, programIndex) => (
                  <div key={programIndex} className="card">
                    <h3 className="text-xl font-bold mb-4">{program.name}</h3>
                    <div className="space-y-4">
                      {program.exercises.map((exercise, exerciseIndex) => (
                        <button
                          key={exerciseIndex}
                          onClick={() => handleViewExercise(exercise)}
                          className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-left"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{exercise.name}</h4>
                            <span className="text-gray-600">
                              {exercise.sets} x {exercise.reps}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowProgramModal(false);
                  handleStartTraining();
                }}
                className="btn-primary w-full mt-6"
              >
                Start Training
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6">
                <iframe
                  src={selectedExercise.videoUrl}
                  title={selectedExercise.name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sets</p>
                  <p className="text-lg font-bold">{selectedExercise.sets}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Reps</p>
                  <p className="text-lg font-bold">{selectedExercise.reps}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rest</p>
                  <p className="text-lg font-bold">{selectedExercise.rest}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tempo</p>
                  <p className="text-lg font-bold">{selectedExercise.tempo}</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Notes from PT</h3>
                  <p className="text-gray-600">{selectedExercise.ptNotes}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">My Notes</h3>
                  <textarea
                    value={exerciseNotes[selectedExercise.name] || ''}
                    onChange={(e) => handleUpdateNotes(selectedExercise.name, e.target.value)}
                    placeholder="Add your notes here..."
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none"
                    rows={3}
                  />
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Training;
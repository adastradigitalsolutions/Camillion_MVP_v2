import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, ChevronRight, X, ChevronLeft, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MuscleGroup, Exercise } from '../types/database';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch muscle groups and exercises on component mount
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        setLoading(true);
        
        // Fetch all muscle groups
        const { data: muscleGroupsData, error: muscleGroupsError } = await supabase
          .from('muscle_groups')
          .select('*')
          .order('name');
        
        if (muscleGroupsError) throw muscleGroupsError;
        
        // Fetch all exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .order('title');
        
        if (exercisesError) throw exercisesError;
        
        setMuscleGroups(muscleGroupsData);
        setExercises(exercisesData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMuscleGroups();
  }, []);

  // Fetch exercises for a specific muscle group when selected
  useEffect(() => {
    const fetchExercisesForMuscleGroup = async () => {
      if (!selectedMuscleGroup) return;
      
      try {
        setLoading(true);
        
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('muscle_group_id', selectedMuscleGroup.id)
          .order('title');
        
        if (exercisesError) throw exercisesError;
        
        setExercises(exercisesData);
      } catch (err: any) {
        console.error('Error fetching exercises:', err);
        setError(err.message || 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercisesForMuscleGroup();
  }, [selectedMuscleGroup]);

  // Filter based on search query
  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    if (!selectedMuscleGroup) {
      // On main page, show muscle groups and matching exercises from search
      const matchingGroups = muscleGroups.filter(group =>
        group.name.toLowerCase().includes(query)
      );

      const matchingExercises = !query ? [] : exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(query)
      );

      return {
        muscleGroups: matchingGroups,
        exercises: matchingExercises
      };
    } else {
      // On muscle group page, only show exercises from that group
      const filteredExercises = exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(query)
      );

      return {
        muscleGroups: [],
        exercises: filteredExercises
      };
    }
  }, [searchQuery, selectedMuscleGroup, muscleGroups, exercises]);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleMuscleGroupClick = (group: MuscleGroup) => {
    setSelectedMuscleGroup(group);
    setSearchQuery(''); // Clear search when entering a muscle group
  };

  // Find muscle group name for an exercise
  const getMuscleGroupName = (muscleGroupId: string) => {
    const group = muscleGroups.find(g => g.id === muscleGroupId);
    return group ? group.name : '';
  };

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    // If it's already an embed URL, return it
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      // Return embed URL with additional parameters for better embedding
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&origin=${window.location.origin}`;
    }
    
    // Return original URL if we couldn't parse it
    return url;
  };

  if (loading && muscleGroups.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="mb-6">
        {selectedMuscleGroup && (
          <button
            onClick={() => {
              setSelectedMuscleGroup(null);
              setSearchQuery('');
            }}
            className="flex items-center text-[--primary] hover:underline mb-4"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to Muscle Groups
          </button>
        )}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={selectedMuscleGroup ? 
              `Search ${selectedMuscleGroup.name} exercises...` : 
              "Search muscle groups or exercises..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4">{selectedExercise.title}</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
              <iframe
                src={getEmbedUrl(selectedExercise.video_url)}
                title={selectedExercise.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="text-gray-600">{selectedExercise.description}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {!selectedMuscleGroup ? (
          // Main page view
          <>
            {/* Show matching exercises from search if any */}
            {searchQuery && filteredResults.exercises.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Matching Exercises</h2>
                {filteredResults.exercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      const group = muscleGroups.find(g => g.id === exercise.muscle_group_id);
                      if (group) {
                        setSelectedMuscleGroup(group);
                      }
                      handleExerciseClick(exercise);
                    }}
                    className="w-full card hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{exercise.title}</h3>
                        <p className="text-sm text-gray-600">{getMuscleGroupName(exercise.muscle_group_id)}</p>
                      </div>
                      <ChevronRight size={20} className="text-[--primary]" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Show muscle groups */}
            <div>
              <h2 className="text-xl font-bold mb-4">Muscle Groups</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.muscleGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => handleMuscleGroupClick(group)}
                    className="card hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={group.image_url}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{group.name}</h3>
                      <ChevronRight size={20} className="text-[--primary]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Muscle group exercises view
          <div>
            <h2 className="text-2xl font-bold mb-6">{selectedMuscleGroup.name} Exercises</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredResults.exercises.length > 0 ? (
              <div className="grid gap-6">
                {filteredResults.exercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseClick(exercise)}
                    className="card hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="aspect-video md:w-1/3 rounded-lg overflow-hidden">
                        <img 
                          src={exercise.image_url} 
                          alt={exercise.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 text-left">
                        <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
                        <p className="text-gray-600 mb-4">{exercise.description}</p>
                        <div className="flex items-center text-[--primary]">
                          <Play size={16} className="mr-2" />
                          <span className="text-sm">Watch video</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No exercises found for this muscle group.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
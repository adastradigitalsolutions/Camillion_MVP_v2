import React, { useState, useEffect } from 'react';
import { Camera, Scale, ChevronRight, ArrowLeft, LogOut, ClipboardEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Load onboarding responses
      const { data: onboarding, error: onboardingError } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (onboardingError) throw onboardingError;

      // Load subscription data
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionError) throw subscriptionError;

      setUserData(user);
      setOnboardingData(onboarding);
      setSubscriptionData(subscription);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [weightHistory] = useState([
    { date: '2024-03-01', weight: 75 },
    { date: '2024-03-08', weight: 74.5 },
    { date: '2024-03-15', weight: 74 },
    { date: '2024-03-22', weight: 73.5 },
    { date: '2024-03-29', weight: 73.2 },
  ]);

  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [showProgressPhotos, setShowProgressPhotos] = useState(false);

  const poses = ['front', 'back', 'left', 'right'];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleModifyQuestionnaire = () => {
    // Store current page to return after questionnaire
    localStorage.setItem('returnToProfile', 'true');
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const progressPhotos = {
    front: {
      before: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-01-01'
      },
      after: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-03-01'
      }
    },
    back: {
      before: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-01-01'
      },
      after: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-03-01'
      }
    },
    left: {
      before: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-01-01'
      },
      after: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-03-01'
      }
    },
    right: {
      before: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-01-01'
      },
      after: {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop',
        date: '2024-03-01'
      }
    }
  };

  if (showProgressPhotos) {
    return (
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => setShowProgressPhotos(false)}
            className="flex items-center text-[--primary] hover:underline mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold">Progress Photos</h1>
        </div>

        <div className="grid gap-8">
          {poses.map((pose) => (
            <div key={pose} className="card">
              <h3 className="text-xl font-bold mb-4 capitalize">{pose} View</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={progressPhotos[pose as keyof typeof progressPhotos].before.url}
                      alt={`${pose} before`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Before - {progressPhotos[pose as keyof typeof progressPhotos].before.date}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={progressPhotos[pose as keyof typeof progressPhotos].after.url}
                      alt={`${pose} after`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    After - {progressPhotos[pose as keyof typeof progressPhotos].after.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
            <img
              src={userData?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2940&auto=format&fit=crop"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">{onboardingData?.full_name || userData?.user_metadata?.name || 'User'}</h1>
          <p className="text-gray-600">{userData?.email}</p>
        </div>

        <div className="grid gap-6">
          {/* Weight Tracking */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Weight History</h2>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <button className="btn-primary w-full">Log Weight</button>
          </div>

          {/* Progress Photos */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Progress Photos</h2>
              <button
                onClick={() => setShowProgressPhotos(true)}
                className="text-[--primary] hover:underline flex items-center"
              >
                View All <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="btn-primary w-full"
            >
              Upload New Photos
            </button>
          </div>

          {/* Questionnaire */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Questionnaire</h2>
              <button
                onClick={handleModifyQuestionnaire}
                className="text-[--primary] hover:underline flex items-center gap-2"
              >
                <ClipboardEdit size={20} />
                Modify Questionnaire
              </button>
            </div>
            <p className="text-gray-600">
              Review and update your fitness profile and preferences
            </p>
          </div>

          {/* Subscription */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">My Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {subscriptionData?.subscription_type || 'Free'} Plan
                </p>
                <p className="text-sm text-gray-600">
                  {subscriptionData?.subscription_type === 'Free' 
                    ? 'Basic features included'
                    : `Valid until ${new Date(subscriptionData?.end_date).toLocaleDateString()}`
                  }
                </p>
              </div>
              <button
                onClick={() => navigate('/subscription')}
                className="flex items-center text-[--primary]"
              >
                Upgrade <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 font-semibold py-3 px-6 rounded-lg border-2 border-red-600 hover:border-red-700 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Progress Photos</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {poses.map((pose) => (
                <button
                  key={pose}
                  onClick={() => setSelectedPose(pose)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center ${
                    selectedPose === pose
                      ? 'border-[--primary] bg-[--primary] bg-opacity-10'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <Camera className="mx-auto mb-2" size={24} />
                    <span className="capitalize">{pose} View</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPhotoUpload(false);
                  setSelectedPose(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                disabled={!selectedPose}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin text-gray-500" size={48} />
    </div>
  );
};

export default LoadingSpinner;

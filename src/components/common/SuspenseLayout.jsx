const SuspenseLayout = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Loader */}
        <div className="w-16 h-16 border-4 border-custom_yellow border-dotted rounded-full animate-spin"></div>
        {/* Loading Text */}
        <p className="text-gray-600 text-lg font-semibold">Loading Page ...</p>
      </div>
    </div>
  );
};

export default SuspenseLayout;

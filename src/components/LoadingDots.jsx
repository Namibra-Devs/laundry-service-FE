const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-2 z-20 w-screen h-screen">
      <div className="w-4 h-4 bg-custom_yellow rounded-full animate-bounce animation-delay-100"></div>
      <div className="w-4 h-4 bg-custom_yellow rounded-full animate-bounce animation-delay-200"></div>
      <div className="w-4 h-4 bg-custom_yellow rounded-full animate-bounce animation-delay-100"></div>
      <div className="w-4 h-4 bg-custom_yellow rounded-full animate-bounce animation-delay-200"></div>
    </div>
  );
};
export default LoadingDots;

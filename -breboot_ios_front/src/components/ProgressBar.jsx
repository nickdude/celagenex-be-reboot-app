const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#F7941C] h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  export default ProgressBar;
  
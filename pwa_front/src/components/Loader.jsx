const Loader = ({ BorderColor = "border-[#F7941C]", isCenter = true }) => {
  return (
    <div className={`${isCenter ? "fixed inset-0 flex items-center justify-center" : "flex items-center justify-center"}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${BorderColor} ${!isCenter ? "h-5 w-5" : "h-8 w-8"}`}></div>
    </div>
  );
};

export default Loader;

export default function Loading() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-black bg-opacity-10 z-50">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin text-white"></div>
    </div>
  );
}

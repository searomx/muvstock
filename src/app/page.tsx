import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex min-w-screen justify-center">
        <div className="flex flex-col min-w-full min-h-[calc(100vh-8.5rem)] bg-slate-700 p-1">
          <div className="grid grid-cols-2 gap-4 items-center justify-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
            <div className="flex w-full h-96 bg-red-300 items-center justify-center">
            </div>
            <div className="flex w-full h-96 bg-blue-500 items-center justify-center">
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

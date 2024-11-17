import VideoUploader from "@/components/VideoUploader";

export default function Home() {
  return (
    <main className="h-screen bg-neutral-950 text-neutral-100 w-full flex flex-col items-center justify-center">
      <h1 className="mb-8 text-sm">reduce</h1>

      <VideoUploader />
    </main>
  );
}

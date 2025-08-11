// import { Sidebar } from "@/app/_components/Sidebar";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p>Hola Mundo desde el front!</p>
        </div>
      </div>
    </HydrateClient>
  );
}

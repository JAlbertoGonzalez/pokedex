import { Sidebar } from "@/app/_components/Sidebar";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.pokemon.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center h-screen overflow-y-auto">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
            </h1>
            <div className="flex flex-col items-center gap-2">
              {hello.greeting}
              <p>Hola Mundo desde el front!</p>
            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}

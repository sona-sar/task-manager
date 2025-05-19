import Header from "@/app/components/Header";
import Main from "./components/Main";
export default function Home() {
  return (
    <div className="bg-white min-h-screen dark:bg-slate-950 text-black dark:text-white transition-all duration-300 px-4 sm:px-10 md:px-20 lg:px-40 py-10">
      <Header />
      <Main />
    </div>
  );
}

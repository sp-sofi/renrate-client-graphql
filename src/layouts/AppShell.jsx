import Navbar from "../components/Navbar";

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default AppShell;

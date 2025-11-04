import { AppNavbar } from "@/components/navbar";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-600">Cargando tu portfolio...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoggedInRoute from "./components/LoggedInRoute";
import OnlyAdminRoute from "./components/OnlyAdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/ui/Spinner";
import Home from "./pages/Home";
import { useSession } from "./hooks/useSession";
import { useTheme } from "./lib/theme";

const Stack = lazy(() => import("./pages/Stack"));
const Search = lazy(() => import("./pages/Search"));
const Post = lazy(() => import("./pages/Post"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const EditPost = lazy(() => import("./pages/EditPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export default function App() {
  useSession();
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post/:postSlug" element={<Post />} />
              <Route path="/stack" element={<Stack />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route element={<LoggedInRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<OnlyAdminRoute />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:postId" element={<EditPost />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </BrowserRouter>
  );
}

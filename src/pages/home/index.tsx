import AnimatedCarousel from "./components/animated-carousel";
import Listarticles from "@/components/list-articles";
import Categories from "./components/categories";

const Home = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 bg-white px-2 py-4 lg:px-4 lg:py-8">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Fetured Articles
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore curated stories, insights, and tutorials across a variety of
          topics from our vibrant community.
        </p>
      </div>
      <AnimatedCarousel />
      <div className="lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="lg:col-span-3 space-y-4">
          <Listarticles />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

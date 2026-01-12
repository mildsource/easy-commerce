import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/products';

export default function Index() {
  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-secondary/30 overflow-hidden">
        <div className="container-shop py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                New Collection
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-4 leading-tight">
                Thoughtfully Crafted
                <span className="text-primary block">For Your Home</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                Discover our curated collection of handcrafted goods, each piece 
                designed to bring warmth and character to your living space.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button size="lg" className="group">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image Grid */}
            <div className="relative grid grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop"
                  alt="Home decor"
                  className="w-full h-64 object-cover rounded-lg shadow-soft-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=300&fit=crop"
                  alt="Kitchen items"
                  className="w-full h-40 object-cover rounded-lg shadow-soft-lg"
                />
              </div>
              <div className="pt-8 space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop"
                  alt="Lighting"
                  className="w-full h-40 object-cover rounded-lg shadow-soft-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=500&fit=crop"
                  alt="Ceramics"
                  className="w-full h-64 object-cover rounded-lg shadow-soft-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-shop py-16 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Featured
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">
              Bestsellers
            </h2>
          </div>
          <Link to="/shop">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Categories Banner */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="container-shop">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">
              Shop by Category
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated categories, each filled with unique pieces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop' },
              { name: 'Textiles', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop' },
              { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=400&fit=crop' },
            ].map((category, index) => (
              <Link 
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-lg aspect-[3/2] animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-xl font-semibold text-background">
                    {category.name}
                  </h3>
                  <span className="text-background/80 text-sm mt-1 flex items-center group-hover:underline">
                    Shop Now
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-shop py-16 lg:py-24">
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground">
            Join Our Newsletter
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Be the first to know about new arrivals, exclusive offers, and artisan stories
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

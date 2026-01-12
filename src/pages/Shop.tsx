import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { mockProducts, categories } from '@/data/products';
import { cn } from '@/lib/utils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  const categoryParam = searchParams.get('category') || 'All';

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by category
    if (categoryParam !== 'All') {
      products = products.filter((p) => p.category === categoryParam);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return products;
  }, [categoryParam, searchQuery, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <div className="container-shop py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
            Shop All
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <aside className="lg:w-48 flex-shrink-0">
            <h3 className="font-heading font-semibold text-foreground mb-4">Categories</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'justify-start',
                    categoryParam === category && 'bg-secondary text-foreground'
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section>
      {title && (
        <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-8">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

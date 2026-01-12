import { Layout } from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="container-shop py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground text-center animate-slide-up">
            Our Story
          </h1>
          
          <div className="mt-12 space-y-8 animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop"
              alt="Artisan workshop"
              className="w-full h-80 object-cover rounded-lg shadow-soft-lg"
            />

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="lead text-xl text-foreground">
                Artisan was born from a simple belief: that the objects we surround ourselves 
                with should be beautiful, meaningful, and made with care.
              </p>

              <p>
                We curate a thoughtful collection of handcrafted home goods, each piece selected 
                for its quality, craftsmanship, and timeless design. Our artisans come from 
                around the world, bringing centuries-old techniques to contemporary living.
              </p>

              <p>
                Every item in our collection tells a story—of skilled hands, sustainable materials, 
                and the quiet joy of owning something truly special. We believe that surrounding 
                yourself with handmade pieces creates a home that feels more personal, more 
                intentional, and more alive.
              </p>

              <h2 className="font-heading text-2xl text-foreground mt-12 mb-4">Our Values</h2>
              
              <ul className="space-y-4">
                <li>
                  <strong className="text-foreground">Quality Over Quantity</strong> — We choose fewer, 
                  better things. Each piece is selected to last and become a cherished part of your home.
                </li>
                <li>
                  <strong className="text-foreground">Sustainable Practices</strong> — We work with artisans 
                  who use natural, sustainable materials and traditional techniques that honor the environment.
                </li>
                <li>
                  <strong className="text-foreground">Fair Trade</strong> — We ensure fair compensation for 
                  all our makers, supporting communities and preserving traditional crafts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

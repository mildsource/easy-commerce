import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container-shop">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-heading text-2xl lg:text-3xl font-bold text-foreground hover:text-primary transition-colors"
          >
            Artisan
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'nav-link text-sm uppercase tracking-wider',
                  location.pathname === link.href && 'nav-link-active'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Admin
                </Button>
              </Link>
            )}
            
            <Link to={user ? '/account' : '/login'}>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'nav-link text-lg py-2',
                    location.pathname === link.href && 'nav-link-active'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nav-link text-lg py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

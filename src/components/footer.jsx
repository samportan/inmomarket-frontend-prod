export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">PropertyHub</h3>
            <p className="text-muted-foreground">
              Your trusted partner in finding the perfect home.
            </p>
            <p className="text-sm text-muted-foreground/70">
              © 2025 PropertyHub. All rights reserved.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">For Buyers</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Mortgage Calculator</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Buyer's Guide</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">For Sellers</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">List Property</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing Tools</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Seller's Guide</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>hello@propertyhub.com</li>
              <li>(555) 123-4567</li>
              <li>123 Main St, City, State</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

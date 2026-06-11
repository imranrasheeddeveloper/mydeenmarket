import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/data";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "All Collections — Islamic Books & Products",
  description:
    "Browse Islamic books, Abaya, Tasbih, Zamzam water, Ihram & more at MyDeenMarket. Free shipping over Rs. 5,000. Cash on delivery across Pakistan.",
  path: "/collections",
});

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";
  const filter = params.filter || "";

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  let filtered = products;
  if (query) {
    filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }
  if (filter === "bestseller") {
    filtered = filtered.filter((p) => p.badge === "bestseller");
  } else if (filter === "new") {
    filtered = filtered.filter((p) => p.badge === "new");
  } else if (filter === "sale") {
    filtered = filtered.filter((p) => p.badge === "sale");
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections" },
  ]);

  const pageTitle = query
    ? `Search results for "${query}"`
    : filter
    ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Products`
    : "All Collections";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-emerald-700" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-gray-900 font-medium" itemProp="name">Collections</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-gray-500">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 shrink-0" aria-label="Filters">
            <div className="sticky top-28">
              {/* Search */}
              <form className="mb-6" action="/collections">
                <label htmlFor="search-collections" className="text-sm font-bold text-gray-900 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="search"
                    id="search-collections"
                    name="q"
                    defaultValue={query}
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Search">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Filter by Type */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Filter</h2>
                <div className="space-y-1.5">
                  <Link
                    href="/collections"
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      !filter ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/collections?filter=bestseller"
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      filter === "bestseller" ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/collections?filter=new"
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      filter === "new" ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/collections?filter=sale"
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      filter === "sale" ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Sale
                  </Link>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3">Categories</h2>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/collections/${cat.slug}`}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                    >
                      {cat.name}
                      <span className="text-gray-400 ml-1">({cat.count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <Link href="/collections" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition-colors">
                  View All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

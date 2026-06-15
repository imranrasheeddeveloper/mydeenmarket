import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { getProductBySlug, getProductsByCategory, getProductReviews, formatPrice } from "@/lib/data";
import { generatePageMetadata, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import AddToCartButton from "./AddToCartButton";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return generatePageMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      noIndex: true,
    });
  }
  return generatePageMetadata({
    title: `${product.name} — Buy Online at Best Price`,
    description: `${product.description.substring(0, 100)} Authentic · Fast Delivery · COD available at MyDeenMarket.`,
    path: `/product/${slug}`,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(product.categorySlug);
  const productReviews = await getProductReviews(product.id);
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections" },
    { name: product.category, url: `/collections/${product.categorySlug}` },
    { name: product.name, url: `/product/${slug}` },
  ]);

  const productSchema = generateProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-emerald-700" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/collections" className="hover:text-emerald-700" itemProp="item">
                <span itemProp="name">Collections</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/collections/${product.categorySlug}`} className="hover:text-emerald-700" itemProp="item">
                <span itemProp="name">{product.category}</span>
              </Link>
              <meta itemProp="position" content="3" />
            </li>
            <li className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-gray-900 font-medium line-clamp-1" itemProp="name">{product.name}</span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" itemScope itemType="https://schema.org/Product">
        <meta itemProp="name" content={product.name} />
        <meta itemProp="description" content={product.description} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ${
                  product.badge === "bestseller" ? "bg-amber-500 text-white" :
                  product.badge === "new" ? "bg-emerald-600 text-white" :
                  "bg-red-500 text-white"
                }`}>
                  {product.badge === "bestseller" ? "Best Seller" : product.badge === "new" ? "New" : "Sale"}
                </span>
              )}
              <svg className="w-20 h-20 text-white/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xl font-bold text-white/80 text-center">{product.name}</span>
              <span className="text-sm text-white/60 mt-2">{product.author}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
              {product.vendor}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" itemProp="name">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center" aria-label={`${product.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < product.rating ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span className="text-3xl font-bold text-gray-900" itemProp="price" content={String(product.price)}>
                {formatPrice(product.price)}
              </span>
              <meta itemProp="priceCurrency" content="PKR" />
              <meta itemProp="availability" content={product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6" itemProp="description">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Key Features</h2>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Specifications</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">Author</dt>
                  <dd className="font-medium text-gray-900" itemProp="author">{product.author}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Language</dt>
                  <dd className="font-medium text-gray-900">{product.language}</dd>
                </div>
                {product.pages && (
                  <div>
                    <dt className="text-gray-500">Pages</dt>
                    <dd className="font-medium text-gray-900">{product.pages}</dd>
                  </div>
                )}
                {product.isbn && (
                  <div>
                    <dt className="text-gray-500">ISBN</dt>
                    <dd className="font-medium text-gray-900" itemProp="isbn">{product.isbn}</dd>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <dt className="text-gray-500">Weight</dt>
                    <dd className="font-medium text-gray-900">{product.weight}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <dt className="text-gray-500">Dimensions</dt>
                    <dd className="font-medium text-gray-900">{product.dimensions}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Publisher</dt>
                  <dd className="font-medium text-gray-900" itemProp="brand">{product.vendor}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-medium text-gray-900">
                    <Link href={`/collections/${product.categorySlug}`} className="text-emerald-700 hover:underline">
                      {product.category}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", text: "Free shipping over Rs.5,000" },
                { icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", text: "100% Authentic" },
                { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Secure Checkout" },
                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", text: "Easy Returns" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} initialReviews={productReviews} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

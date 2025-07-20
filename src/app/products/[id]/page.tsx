import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/products';
import { ProductView } from '@/components/products/product-view';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(parseInt(params.id, 10));

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}

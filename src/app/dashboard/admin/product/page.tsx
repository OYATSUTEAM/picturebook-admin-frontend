import { FileManagerView } from 'src/sections/file-manager/view';
import { ProductListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product List',
};

export default function ProductListPage() {
  // return <ProductListView />;
  return <FileManagerView />;
}

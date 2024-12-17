import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { hydrateCart } from './store/cartSlice';
import { ProductGrid } from './components/product';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const isHydrated = useSelector((state: RootState) => state.cart.isHydrated);

  useEffect(() => {
    // Hydrate cart on app initialization
    if (!isHydrated) {
      dispatch(hydrateCart());
    }
  }, [dispatch, isHydrated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shelf Scout</h1>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-600">Product Catalog</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
              <p className="text-gray-500 text-sm">Filter options coming soon...</p>
            </div>
          </aside>

          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2024 Shelf Scout. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

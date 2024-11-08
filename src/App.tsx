import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProductGrid } from './components/ProductGrid';
import { FilterSidebar } from './components/FilterSidebar';
import { Cart } from './components/Cart';
import { useState } from 'react';

/**
 * Main application component
 * Provides Redux store and renders the main layout
 */
function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);

	return (
		<Provider store={store}>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<header className="sticky top-0 z-40 bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center">
								<button
									type="button"
									className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
									onClick={() => setSidebarOpen(!sidebarOpen)}
								>
									<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								</button>
								<h1 className="ml-2 lg:ml-0 text-xl font-bold text-gray-900">Shelf Scout</h1>
							</div>
							<button
								type="button"
								className="relative p-2 text-gray-600 hover:text-gray-900"
								onClick={() => setCartOpen(!cartOpen)}
							>
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</button>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex gap-6">
						{/* Filter Sidebar */}
						<FilterSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

						{/* Product Grid */}
						<main className="flex-1">
							<ProductGrid />
						</main>
					</div>
				</div>

				{/* Cart Drawer */}
				<Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
			</div>
		</Provider>
	);
}

export default App;
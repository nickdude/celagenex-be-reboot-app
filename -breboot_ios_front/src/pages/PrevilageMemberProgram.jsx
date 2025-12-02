import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CategoryCard, ProductCard, BrandCard } from '../components/cards';
import { BottomNavBarMemberProgram } from '../components/BottomNavBar';
import dumy_1 from "../assets/images/dumy_1.jpg";
import dumy_2 from "../assets/images/dumy_2.jpg";
import Header from '../components/Header';
import { ShoppingCart } from 'lucide-react';


const categories = [
    { id: 1, title: 'Skincare', icon: '🧴' },
    { id: 2, title: 'Supplements', icon: '💊' },
    { id: 3, title: 'Personal Care', icon: '🪥' },
    { id: 4, title: 'Herbal Remedies', icon: '🌿' },
];

const featuredBrands = [
    { id: 1, name: 'Cetaphil', bgImage: dumy_2 },
    { id: 2, name: 'Nature’s Bounty', bgImage: dumy_2 },
    { id: 3, name: 'Himalaya', bgImage: dumy_2 },
    { id: 4, name: 'La Roche-Posay', bgImage: dumy_2 },
];

const products = [
    { id: 1, name: 'Vitamin C Serum', price: '29 INR', image: dumy_1 },
    { id: 2, name: 'Collagen Booster', price: '39 INR', image: dumy_1 },
    { id: 3, name: 'Herbal Shampoo', price: '19 INR', image: dumy_1 },
];

const MemberProgramPage = () => {
    return (
        <div className="min-h-screen text-gray-900 font-poppins">

            <div>
            <Header title={"Member Program"} icon ={<ShoppingCart />} />

            </div>

            <div className="px-4 py-4 pb-24">
                {/* Categories */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Shop by Category</h2>
                        <button className="flex items-center text-sm text-primary text-[#F7941C]">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} {...category} />
                        ))}
                    </div>
                </div>

                {/* Featured Brands */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Featured Brands</h2>
                        <button className="flex items-center text-sm text-primary text-[#F7941C]">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {featuredBrands.map((brand) => (
                            <BrandCard key={brand.id} {...brand} />
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Exclusive Member Offers</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 overflow-x-auto no-scrollbar pb-2">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>

            <BottomNavBarMemberProgram />
        </div>
    );
};

export default MemberProgramPage;

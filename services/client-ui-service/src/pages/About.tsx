import React, { useState, useEffect } from 'react';
import NavigationHeader from '@/components/navigation/NavigationHeader';
import { useUser } from '@/context/UserContext';
import { FaGlobeAfrica, FaHandshake, FaUsers, FaBullhorn } from 'react-icons/fa';
import FooterSection from '@/components/layouts/FooterSection';
import { ContentRepository } from '@/repository/ContentRepository';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface AboutContent {
    section: {
        id: string;
        title: string;
        content: string;
        metadata?: {
            mission?: string;
            vision?: string;
            established?: string;
            incorporated?: string;
        };
    } | null;
    items: any[];
}

const About: React.FC = () => {
    const { user } = useUser();
    const [aboutContent, setAboutContent] = useState<AboutContent>({ section: null, items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAboutContent();
    }, []);

    const loadAboutContent = async () => {
        try {
            setLoading(true);
            const data = await ContentRepository.getContentBySection('about-page');
            setAboutContent(data);
        } catch (error) {
            console.error('Failed to load about content:', error);
            // Fallback to default content if CMS fails
            setAboutContent({ section: null, items: [] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            <NavigationHeader isAuthenticated={!!user} />

            <LoadingOverlay isLoading={loading} message="Loading about information..." />

            {/* Hero Section */}
            <div className="relative w-full h-96 flex items-center justify-center bg-gradient-to-r from-green-900/90 to-green-700/80">
                <div className="absolute inset-0 bg-[url('/images/background3.png')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 text-center text-white px-8 md:px-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                        {aboutContent.section?.title || "The Lagos International Trade Fair"}
                    </h1>
                    <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
                        {aboutContent.section?.content || "Nigeria's Premier Platform for Trade, Innovation, and Business Networking"}
                    </p>
                </div>
            </div>

            {/* Main Content Card */}
            <section className="max-w-6xl mx-auto -mt-16 bg-white rounded-3xl shadow-xl p-4 md:p-12 relative z-20">
                {/* Image and Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="order-2 lg:order-1">
                        <img
                            src="/images/about.jpg"
                            alt="Lagos Chamber of Commerce and Industry"
                            className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500 border-4 border-primary-100"
                        />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl font-bold text-green-800 mb-6">Lagos Chamber of Commerce and Industry</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {aboutContent.section?.metadata?.mission || 
                            "Founded in 1888, the Lagos Chamber of Commerce and Industry is the Premier Chamber of Commerce in Nigeria. Incorporated in 1950 as a non-profit organization, LCCI promotes the interests of the business community in Lagos and across Nigeria."}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-700">
                                    {aboutContent.section?.metadata?.established || "1888"}
                                </div>
                                <div className="text-sm text-gray-600">Founded</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {aboutContent.section?.metadata?.incorporated || "1950"}
                                </div>
                                <div className="text-sm text-gray-600">Incorporated</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1 flex items-center gap-4">
                        <FaGlobeAfrica className="text-green-700 text-3xl" />
                        <div>
                            <h2 className="text-xl font-bold text-green-800 mb-1">Largest International Trade Fair in Nigeria</h2>
                            <p className="text-gray-700">Held annually since 1981, attracting exhibitors and visitors from all over the world.</p>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                        <FaHandshake className="text-red-500 text-3xl" />
                        <div>
                            <h2 className="text-xl font-bold text-red-600 mb-1">Business & Networking</h2>
                            <p className="text-gray-700">A hub for top organizations, policy makers, and professionals to connect and collaborate.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1 flex items-center gap-4">
                        <FaUsers className="text-green-700 text-3xl" />
                        <div>
                            <h2 className="text-xl font-bold text-green-800 mb-1">Diverse Participation</h2>
                            <p className="text-gray-700">Open to local and foreign exhibitors, with growing interest and attendance every year.</p>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                        <FaBullhorn className="text-red-500 text-3xl" />
                        <div>
                            <h2 className="text-xl font-bold text-red-600 mb-1">Wide Publicity</h2>
                            <p className="text-gray-700">Extensive media coverage and unique opportunities for product and service promotion.</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-2xl font-semibold text-green-800 mb-4">About the Fair</h3>
                    <div className="text-gray-700 whitespace-pre-line">
                        {aboutContent.section?.metadata?.about_fair_content || 
                        `The Lagos International Trade Fair is the largest International Trade Fair in Nigeria. The spectacular 10-day event usually begins on the first Friday in November of every year, since 1981. The Lagos Chamber of Commerce and Industry (LCCI) took over the organisation of the fair in 1986 and has been staging the fair annually to date.

Since then, the Lagos International Trade Fair has grown tremendously in popularity to become the leading forum for Trade and Business promotion in Nigeria, and indeed Africa. The Chamber is uniquely aware of the high standards expected of an International Trade Fair, and it is, therefore, constantly striving to live up to this expectation.

Key Features:
• Accessible location in Lagos, the commercial and industrial heartland of Nigeria
• Supported by Federal and Lagos State Governments, and the private sector
• Opportunities for sector groups and professionals to present new products and ideas
• Hospitality and tourism programs for foreign visitors
• Assistance from experienced Trade Promotion Board members and LCCI staff

The Fair brings into focus the full potentials and business opportunities existing in Nigeria, with eminent dignitaries and policy makers attending throughout its duration.`}
                    </div>
                </div>
            </section>
            <FooterSection />
        </div>
    );
};

export default About; 
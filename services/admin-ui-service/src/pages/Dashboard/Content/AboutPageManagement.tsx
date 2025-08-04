
import React, { useState, useEffect } from "react";
import { ContentRepository } from "../../../repository/ContentRepository";
import {
  ContentSection,
  ContentItem,
} from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const AboutPageManagement: React.FC = () => {
  const [aboutPageData, setAboutPageData] = useState<{
    section: ContentSection | null;
    items: ContentItem[];
  }>({ section: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAboutPageContent();
  }, []);

  const loadAboutPageContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getAboutPageContent();
      setAboutPageData(data);
    } catch (error) {
      console.error("Failed to load about page content:", error);
      setErrorMessage("Failed to load about page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const updateAboutPageSection = async (sectionData: any) => {
    try {
      setLoading(true);
      if (aboutPageData.section) {
        await ContentRepository.updateContentSection(
          aboutPageData.section.id,
          sectionData
        );
        setSuccessMessage("About page content updated successfully!");
        setShowSuccessDialog(true);
        await loadAboutPageContent();
      }
    } catch (error) {
      console.error("Failed to update about page content:", error);
      setErrorMessage("Failed to update about page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !aboutPageData.section) {
    return (
      <LoadingOverlay
        isLoading={true}
        message="Loading about page content..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={loading} message="Processing..." />

      <SuccessDialog
        isOpen={showSuccessDialog}
        message={successMessage}
        onRedirect={() => setShowSuccessDialog(false)}
        buttonText="Continue"
        showButton={true}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
        buttonText="Try Again"
        showButton={true}
      />

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            About Page Content Management
          </h1>
          <p className="text-gray-600">
            Manage about page content including mission, vision, and
            organizational details
          </p>
        </div>

        {aboutPageData.section && (
          <div className="space-y-8">
            {/* About Page Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                About Page Information
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const sectionData = {
                    title: formData.get("title") as string,
                    content: formData.get("content") as string,
                    metadata: {
                      mission: formData.get("mission") as string,
                      vision: formData.get("vision") as string,
                      established: formData.get("established") as string,
                      incorporated: formData.get("incorporated") as string,
                      about_fair_content: formData.get("about_fair_content") as string,
                    },
                    is_active: aboutPageData.section?.is_active || true,
                    display_order: aboutPageData.section?.display_order || 11,
                  };
                  updateAboutPageSection(sectionData);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={aboutPageData.section.title}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Description
                  </label>
                  <textarea
                    name="content"
                    defaultValue={aboutPageData.section.content}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Organization Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Organization Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Established Year
                      </label>
                      <input
                        type="text"
                        name="established"
                        defaultValue={
                          aboutPageData.section.metadata?.established || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 1888"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Incorporated Year
                      </label>
                      <input
                        type="text"
                        name="incorporated"
                        defaultValue={
                          aboutPageData.section.metadata?.incorporated || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 1950"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Statement
                      </label>
                      <textarea
                        name="mission"
                        defaultValue={
                          aboutPageData.section.metadata?.mission || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter organization mission"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vision Statement
                      </label>
                      <textarea
                        name="vision"
                        defaultValue={
                          aboutPageData.section.metadata?.vision || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter organization vision"
                      />
                    </div>
                  </div>
                </div>

                {/* About the Fair Content - Rich Text Editor */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="flex items-center gap-2 mb-6">
                    <InformationCircleIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      About the Fair Content
                    </h3>
                  </div>
                  
                  <div className="bg-blue-100 border-l-4 border-blue-500 rounded-r-lg p-4 mb-6">
                    <div className="flex items-start">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          Rich Text Content Editor
                        </p>
                        <p className="text-sm text-blue-700">
                          This content will be displayed exactly as formatted in the "About the Fair" section. 
                          Use line breaks and formatting as needed for optimal presentation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Fair Description Content
                    </label>
                    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-700 font-medium">
                            📝 Formatting Guidelines
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>• Bullet points</span>
                            <span>↵ Line breaks</span>
                            <span>¶ Paragraphs</span>
                          </div>
                        </div>
                      </div>
                      <textarea
                        name="about_fair_content"
                        defaultValue={
                          aboutPageData.section.metadata?.about_fair_content || 
                          `The Lagos International Trade Fair is the largest International Trade Fair in Nigeria. The spectacular 10-day event usually begins on the first Friday in November of every year, since 1981. The Lagos Chamber of Commerce and Industry (LCCI) took over the organisation of the fair in 1986 and has been staging the fair annually to date.

Since then, the Lagos International Trade Fair has grown tremendously in popularity to become the leading forum for Trade and Business promotion in Nigeria, and indeed Africa. The Chamber is uniquely aware of the high standards expected of an International Trade Fair, and it is, therefore, constantly striving to live up to this expectation.

Key Features:
• Accessible location in Lagos, the commercial and industrial heartland of Nigeria
• Supported by Federal and Lagos State Governments, and the private sector
• Opportunities for sector groups and professionals to present new products and ideas
• Hospitality and tourism programs for foreign visitors
• Assistance from experienced Trade Promotion Board members and LCCI staff

The Fair brings into focus the full potentials and business opportunities existing in Nigeria, with eminent dignitaries and policy makers attending throughout its duration.`
                        }
                        rows={22}
                        className="w-full border-0 px-4 py-4 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-sm leading-relaxed text-gray-800"
                        placeholder="Enter detailed content about the fair..."
                        style={{ 
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          minHeight: '400px'
                        }}
                      />
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-green-700">
                          <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">Preserves line breaks</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700">
                          <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">Supports bullet points</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-700">
                          <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                          <span className="font-medium">Maintains paragraph spacing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Update About Page Content
                  </button>
                </div>
              </form>
            </div>

            {/* Feature Items Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  About Page Features
                </h2>
                <button
                  onClick={() => {
                    const newItem = {
                      title: "New Feature",
                      content: "Feature description",
                      metadata: {},
                    };
                    // Add new item functionality here
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-4">
                {aboutPageData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Feature {index + 1}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Edit functionality
                          }}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Delete functionality
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feature Title
                        </label>
                        <input
                          type="text"
                          defaultValue={item.title}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="Feature title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feature Description
                        </label>
                        <textarea
                          defaultValue={item.content}
                          rows={2}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="Feature description"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {aboutPageData.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No features added yet. Click "Add Feature" to create your first feature.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageManagement;

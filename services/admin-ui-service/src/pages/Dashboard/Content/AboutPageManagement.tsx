
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
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <InformationCircleIcon className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      About the Fair Content
                    </h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>WYSIWYG Editor:</strong> This content will be displayed exactly as you format it in the "About the Fair" section on the About page. Use line breaks and formatting as needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Content Editor
                    </label>
                    <div className="bg-white border border-gray-300 rounded-lg">
                      <div className="border-b border-gray-200 px-3 py-2 bg-gray-50 rounded-t-lg">
                        <p className="text-xs text-gray-600 font-medium">Formatting Tips: Use • for bullet points, leave empty lines for paragraphs</p>
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
                        rows={20}
                        className="w-full border-0 rounded-b-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm leading-relaxed"
                        placeholder="Enter detailed content about the fair..."
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Line breaks preserved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Bullet points supported</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Paragraph spacing included</span>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageManagement;

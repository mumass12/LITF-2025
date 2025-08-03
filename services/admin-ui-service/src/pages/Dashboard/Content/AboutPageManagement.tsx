import React, { useState, useEffect } from "react";
import { ContentRepository } from "../../../repository/ContentRepository";
import {
  ContentSection,
  ContentItem,
} from "../../../repository/ContentRepository";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import SuccessDialog from "../../../components/common/SuccessDialog";
import ErrorDialog from "../../../components/common/ErrorDialog";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
                    },
                    is_active: aboutPageData.section?.is_active || true,
                    display_order: aboutPageData.section?.display_order || 11,
                  };
                  updateAboutPageSection(sectionData);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  <textarea
                    name="mission"
                    defaultValue={aboutPageData.section.metadata?.mission || ""}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter the organization's mission statement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Statement
                  </label>
                  <textarea
                    name="vision"
                    defaultValue={aboutPageData.section.metadata?.vision || ""}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter the organization's vision statement"
                  />
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

            {/* About Page Items/Sections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  About Page Sections ({aboutPageData.items.length})
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Add Section
                </button>
              </div>

              {aboutPageData.items.length > 0 ? (
                <div className="space-y-4">
                  {aboutPageData.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">
                          Type: {item.metadata?.section_type || "General"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full font-medium ${
                            item.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">No sections added yet</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Add your first section
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageManagement;

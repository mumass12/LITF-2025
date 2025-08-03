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
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ContactPageManagement: React.FC = () => {
  const [contactSection, setContactSection] = useState<ContentSection | null>(
    null
  );
  const [contactItems, setContactItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadContactPageContent();
  }, []);

  const loadContactPageContent = async () => {
    try {
      setLoading(true);
      const data = await ContentRepository.getContactPageContent();
      setContactSection(data.section);
      setContactItems(data.items);
    } catch (error) {
      console.error("Failed to load contact page content:", error);
      setErrorMessage("Failed to load contact page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const updateContactPageContent = async (formData: FormData) => {
    try {
      setLoading(true);
      const sectionData = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        metadata: {
          main_office: {
            address: formData.get("main_address") as string,
            phone: formData.get("main_phone") as string,
            email: formData.get("main_email") as string,
            working_hours: formData.get("main_hours") as string,
          },
          support_office: {
            address: formData.get("support_address") as string,
            phone: formData.get("support_phone") as string,
            email: formData.get("support_email") as string,
            working_hours: formData.get("support_hours") as string,
          },
        },
        is_active: contactSection?.is_active || true,
        display_order: contactSection?.display_order || 12,
      };

      if (contactSection) {
        await ContentRepository.updateContentSection(
          contactSection.id,
          sectionData
        );
        setSuccessMessage("Contact page content updated successfully!");
        setShowSuccessDialog(true);
        await loadContactPageContent();
      }
    } catch (error) {
      console.error("Failed to update contact page content:", error);
      setErrorMessage("Failed to update contact page content");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateContactPageContent(formData);
  };

  if (loading && !contactSection) {
    return (
      <LoadingOverlay
        isLoading={true}
        message="Loading contact page content..."
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
            Contact Page Content Management
          </h1>
          <p className="text-gray-600">
            Manage contact information, office details, and communication
            channels
          </p>
        </div>

        {contactSection && (
          <div className="space-y-8">
            {/* Main Contact Page Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Page Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={contactSection.title}
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
                    defaultValue={contactSection.content}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Main Office Information */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Main Office
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="main_address"
                        defaultValue={
                          contactSection.metadata?.main_office?.address || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter main office address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="main_phone"
                        defaultValue={
                          contactSection.metadata?.main_office?.phone || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+234 1 2701813"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="main_email"
                        defaultValue={
                          contactSection.metadata?.main_office?.email || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="info@lagoschamber.com"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        Working Hours
                      </label>
                      <input
                        type="text"
                        name="main_hours"
                        defaultValue={
                          contactSection.metadata?.main_office?.working_hours ||
                          ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* Support Office Information */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Support Office
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="support_address"
                        defaultValue={
                          contactSection.metadata?.support_office?.address || ""
                        }
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter support office address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="support_phone"
                        defaultValue={
                          contactSection.metadata?.support_office?.phone || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+234 1 2701814"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="support_email"
                        defaultValue={
                          contactSection.metadata?.support_office?.email || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="support@lagoschamber.com"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="w-4 h-4 inline mr-1" />
                        Working Hours
                      </label>
                      <input
                        type="text"
                        name="support_hours"
                        defaultValue={
                          contactSection.metadata?.support_office
                            ?.working_hours || ""
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Monday - Friday: 9:00 AM - 4:00 PM"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Update Contact Page Content
                  </button>
                </div>
              </form>
            </div>

            {/* Department-specific Contacts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Department Contacts ({contactItems.length})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage department-specific contact information
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  Add Department
                </button>
              </div>

              {contactItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            {item.metadata?.office_type || "General"}
                          </span>
                          {item.metadata?.department && (
                            <span className="inline-block mt-1 ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {item.metadata.department}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
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
                          Order: {item.display_order}
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
                  <p className="text-gray-500 mb-4">
                    No department contacts added yet
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Add your first department contact
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

export default ContactPageManagement;

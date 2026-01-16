import React, { useState, useEffect } from 'react';

/**
 * Generic Sidebar Component
 * @param {boolean} isOpen - Controls sidebar visibility
 * @param {function} onClose - Callback when sidebar should close
 * @param {function} onSubmit - Callback with form data on submit
 * @param {string} title - Sidebar title
 * @param {string} submitLabel - Submit button text (default: "Submit")
 * @param {object} initialData - Initial form data
 * @param {array} fields - Array of field configs: { name, label, type, required, options }
 */
export default function Sidebar({
  isOpen,
  onClose,
  onSubmit,
  title = 'Form',
  submitLabel = 'Submit',
  initialData = {},
  fields = []
}) {
  const [formData, setFormData] = useState(initialData);

  // Update formData when initialData changes (e.g., when editing a product)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const field = fields.find(f => f.name === name);
    
    setFormData((prev) => ({
      ...prev,
      [name]: field?.type === 'number' ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={value}
          onChange={handleInputChange}
          rows={field.rows || 3}
          required={field.required}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          name={field.name}
          value={value}
          onChange={handleInputChange}
          required={field.required}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {field.options && field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type || 'text'}
        name={field.name}
        value={value}
        onChange={handleInputChange}
        step={field.step}
        required={field.required}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-500 ${isOpen ? 'translate-x-0 animate-slide-in' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label} {field.required && '*'}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

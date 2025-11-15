
import React, { useState } from 'react';
import type { LogEntry } from '../types';

interface AddEntryFormProps {
  onAddEntry: (entry: Omit<LogEntry, 'id' | 'entryTime' | 'exitTime'>) => void;
  onClose: () => void;
}

type FormData = Omit<LogEntry, 'id' | 'entryTime' | 'exitTime'>;

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onAddEntry, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    capacity: '',
    vehicleType: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('الرجاء إدخال الاسم.');
      return;
    }
    onAddEntry(formData);
    onClose();
  };

  const formFields = [
    { name: 'name', label: 'الاسم', type: 'text', required: true },
    { name: 'capacity', label: 'الصفة', type: 'text' },
    { name: 'vehicleType', label: 'نوع المركبة', type: 'text' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof FormData]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
              required={field.required}
            />
          </div>
      ))}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
        ></textarea>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          حفظ الإدخال
        </button>
      </div>
    </form>
  );
};

export default AddEntryForm;
   
import React, { useState, useEffect } from 'react';

const apiResponses = {
  userInfo: {
    fields: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      { name: 'age', type: 'number', label: 'Age', required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: 'street', type: 'text', label: 'Street', required: true },
      { name: 'city', type: 'text', label: 'City', required: true },
      { name: 'state', type: 'dropdown', label: 'State', options: ['California', 'Texas', 'New York'], required: true },
      { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
      { name: 'cvv', type: 'password', label: 'CVV', required: true },
      { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
    ],
  },
};

const DynamicForm = () => {
  const [formType, setFormType] = useState('userInfo');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    setFormFields(apiResponses[formType].fields);
    setFormData({});
    setErrors({});
    setProgress(0);
  }, [formType]);

  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (field.required && value) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const currentData = submittedData[formType] || [];
      if (editingIndex !== null) {
        currentData[editingIndex] = formData;
      } else {
        currentData.push(formData);
      }
      setSubmittedData((prev) => ({
        ...prev,
        [formType]: currentData,
      }));
      setFormData({});
      setEditingIndex(null);
      alert('Form submitted successfully!');
    }
  };

  useEffect(() => {
    const completedFields = formFields.filter((field) => formData[field.name]);
    setProgress((completedFields.length / formFields.length) * 100);
  }, [formData, formFields]);
 
  const handleEdit = (index) => {
    setFormData(submittedData[formType][index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const filteredData = submittedData[formType].filter((_, i) => i !== index);
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: filteredData,
    }));
    alert('Data deleted successfully!');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dynamic Form</h2>

      <label className="block mb-4">
        Select Form Type:
        <select value={formType} onChange={(e) => setFormType(e.target.value)} className="block w-full p-2 border">
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>
      </label>

      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block mb-2">
              {field.label} {field.required && '*'}
            </label>
            
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(e, field)}
                className="block w-full p-2 border"
              />
            
            {errors[field.name] && <p className="text-red-500">{errors[field.name]}</p>}
          </div>
        ))}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {editingIndex !== null ? 'Update' : 'Submit'}
        </button>
      </form>

      <div className="mt-4">
        <div className="bg-gray-200 h-2 rounded-full">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{Math.round(progress)}% Complete</p>
      </div>

      {submittedData[formType]?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Submitted Data for {formType}</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(submittedData[formType][0]).map((key) => (
                  <th key={key} className="border border-gray-300 p-2">
                    {key}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData[formType].map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i} className="border border-gray-300 p-2">
                      {value}
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;

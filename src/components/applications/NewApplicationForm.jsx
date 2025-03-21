import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import supabase from "../../../createClient";

const NewApplicationForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: "volunteer",
    title: "",
    degree: "highschool",
    location: "",
    deadline: "",
    picture: "",
    description: "",
    paid: false, // ✅ New paid toggle
    salary: "",  // ✅ New salary input (only if paid)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      console.error("❌ Error getting user:", authError?.message);
      return;
    }

    const orgId = authData.user.id;

    const { error } = await supabase.from("announcements").insert([
      {
        organization_id: orgId,
        type: formData.type,
        title: formData.title,
        degree: formData.degree,
        location: formData.location,
        deadline: formData.deadline,
        image_url: formData.picture,
        description: formData.description || "No description provided.",
        paid: formData.paid, // ✅ Store paid status
        salary: formData.paid ? formData.salary : null, // ✅ Only store salary if paid
      },
    ]);

    if (error) {
      console.error("❌ Error submitting announcement:", error.message);
    } else {
      onSuccess?.(formData);
      onClose?.();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
      <div className="text-2xl font-semibold mb-6">New Announcement</div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="volunteer">Volunteer</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="highschool">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="coop">CO-OP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <Input name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Picture URL</label>
          <Input
            type="url"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {/* ✅ New Paid Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="paid"
            checked={formData.paid}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="text-sm font-medium text-gray-700">Is this a paid opportunity?</label>
        </div>

        {/* ✅ Salary Input (Only if Paid) */}
        {formData.paid && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary (per month)</label>
            <Input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              min="1"
              required={formData.paid}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description..."
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default NewApplicationForm;

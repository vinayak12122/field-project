import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Save, LocateFixed, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function AddAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    room: "",
    landmark: "",
    state: "",
    district: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim()) {
        toast.error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
        );
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("userAddress", JSON.stringify(form));
      setIsSaving(false);
      toast.success("Address saved successfully ✅");
      navigate(-1);
    }, 500);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser.");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            landmark: data.address.road || "",
            state: data.address.state || "",
            district: data.address.city || data.address.town || data.address.village || "",
            pincode: data.address.postcode || "",
          }));
          toast.success("Location fetched successfully 📍");
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch location details.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        toast.error("Location access denied or unavailable.");
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="p-2 border-b sticky top-0 bg-white z-20 flex items-center shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 mr-4 text-gray-600 hover:text-sky-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
          <Home className="text-sky-600" size={20} />
          {localStorage.getItem("userAddress") ? "Edit Delivery Address" : "Add New Address"}
        </h2>
      </div>

      {/* Body */}
      <div className="max-w-xl mx-auto flex-grow p-6 space-y-8">
        {/* Location Button */}
        <button
          onClick={handleUseLocation}
          disabled={isLoadingLocation}
          className={`w-full flex items-center justify-center gap-3 py-4 font-semibold text-lg rounded-lg transition-colors duration-300
            ${isLoadingLocation
              ? "bg-sky-100 text-sky-600 cursor-not-allowed"
              : "bg-white text-sky-600 border border-sky-600 hover:bg-sky-50"}`}
        >
          {isLoadingLocation ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Fetching Address...
            </>
          ) : (
            <>
              <LocateFixed size={20} /> Use Current Location
            </>
          )}
        </button>

        {/* Separator */}
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="text-sm font-medium">Manual Entry</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <input
            type="text"
            name="room"
            value={form.room}
            onChange={handleChange}
            placeholder="Flat / House No. / Building Name"
            className="w-full border-b-2 border-gray-300 py-3 text-lg text-gray-800 focus:border-sky-500 focus:outline-none"
          />
          <input
            type="text"
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Street Name / Area / Landmark"
            className="w-full border-b-2 border-gray-300 py-3 text-lg text-gray-800 focus:border-sky-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full border-b-2 border-gray-300 py-3 text-lg text-gray-800 focus:border-sky-500 focus:outline-none"
            />
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="City / District"
              className="w-full border-b-2 border-gray-300 py-3 text-lg text-gray-800 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border-b-2 border-gray-300 py-3 text-lg text-gray-800 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-1xl z-30">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full font-raleway flex items-center justify-center gap-3 px-6 py-2 text-xl font-bold rounded-lg transition-colors duration-300
              ${isSaving ? "bg-green-400 cursor-not-allowed" : "bg-gradient-to-l from-green-600 to-green-800 "} text-white`}
          >
            {isSaving ? (
              <>
                <Loader2 size={22} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={22} />
                {localStorage.getItem("userAddress") ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}

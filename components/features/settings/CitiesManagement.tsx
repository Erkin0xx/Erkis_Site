"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Check, X, Loader2 } from "lucide-react";
import type { City } from "@/lib/services/cities-service";

export function CitiesManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    latitude: "",
    longitude: "",
    status: "visited" as "visited" | "wishlist",
    visit_date: "",
    notes: "",
  });

  const visitedCities = cities.filter((c) => c.status === "visited");
  const wishlistCities = cities.filter((c) => c.status === "wishlist");

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    try {
      const response = await fetch("/api/cities");
      const data = await response.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCities();
        setShowForm(false);
        setFormData({
          name: "",
          country: "",
          latitude: "",
          longitude: "",
          status: "visited",
          visit_date: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Failed to add city:", error);
    }
  }

  async function handleDeleteCity(id: string) {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      const response = await fetch(`/api/cities/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCities();
      }
    } catch (error) {
      console.error("Failed to delete city:", error);
    }
  }

  async function handleToggleStatus(city: City) {
    const newStatus = city.status === "visited" ? "wishlist" : "visited";

    try {
      const response = await fetch(`/api/cities/${city.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchCities();
      }
    } catch (error) {
      console.error("Failed to update city:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-zinc-100">My Cities</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add City"}
        </motion.button>
      </div>

      {/* Add City Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCity}
            className="space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  City Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Tokyo"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Japan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                  placeholder="35.6762"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                  placeholder="139.6503"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "visited" | "wishlist",
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="visited">Visited</option>
                  <option value="wishlist">Wishlist</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) =>
                    setFormData({ ...formData, visit_date: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 backdrop-blur-xl focus:border-purple-500 focus:outline-none"
                rows={3}
                placeholder="Add any notes about your visit or plans..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              Add City
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Visited Cities Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-200">
          Visited Cities ({visitedCities.length})
        </h3>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Visit Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {visitedCities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-zinc-400"
                    >
                      No visited cities yet. Add one above!
                    </td>
                  </tr>
                ) : (
                  visitedCities.map((city) => (
                    <tr key={city.id} className="hover:bg-white/5">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-100">
                        {city.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {city.country}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {city.visit_date
                          ? new Date(city.visit_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleStatus(city)}
                            className="rounded-lg bg-blue-600/20 p-2 text-blue-400 hover:bg-blue-600/30"
                            title="Move to wishlist"
                          >
                            <Check className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCity(city.id)}
                            className="rounded-lg bg-red-600/20 p-2 text-red-400 hover:bg-red-600/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Wishlist Cities Table */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-zinc-200">
          Wishlist Cities ({wishlistCities.length})
          <span className="text-sm font-normal text-zinc-400">
            (These blink on the map!)
          </span>
        </h3>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {wishlistCities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-zinc-400"
                    >
                      No wishlist cities yet. Add one above!
                    </td>
                  </tr>
                ) : (
                  wishlistCities.map((city) => (
                    <tr key={city.id} className="hover:bg-white/5">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-100">
                        {city.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                        {city.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {city.notes || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleStatus(city)}
                            className="rounded-lg bg-green-600/20 p-2 text-green-400 hover:bg-green-600/30"
                            title="Mark as visited"
                          >
                            <Check className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCity(city.id)}
                            className="rounded-lg bg-red-600/20 p-2 text-red-400 hover:bg-red-600/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

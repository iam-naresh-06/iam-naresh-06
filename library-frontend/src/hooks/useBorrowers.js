import { useState, useEffect } from "react";
import * as borrowerService from "../services/borrowerService";

// Custom hook for managing borrowers
export default function useBorrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBorrowers = async () => {
    setLoading(true);
    try {
      const response = await borrowerService.getAllBorrowers();
      setBorrowers(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch borrowers");
    } finally {
      setLoading(false);
    }
  };

  const addBorrower = async (borrower) => {
    try {
      const response = await borrowerService.addBorrower(borrower);
      setBorrowers((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.message || "Failed to add borrower");
    }
  };

  const updateBorrower = async (id, borrower) => {
    try {
      const response = await borrowerService.updateBorrower(id, borrower);
      setBorrowers((prev) =>
        prev.map((b) => (b.id === id ? response.data : b))
      );
    } catch (err) {
      setError(err.message || "Failed to update borrower");
    }
  };

  const deleteBorrower = async (id) => {
    try {
      await borrowerService.deleteBorrower(id);
      setBorrowers((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete borrower");
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  return {
    borrowers,
    loading,
    error,
    fetchBorrowers,
    addBorrower,
    updateBorrower,
    deleteBorrower,
  };
}

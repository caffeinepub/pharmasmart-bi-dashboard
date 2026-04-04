import { usePharmacy } from "@/context/PharmacyContext";
import { Search, ShieldAlert, Trash2, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

export function CustomerList() {
  const { customers, addCustomerOnly, deleteCustomer } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, searchQuery]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError("Name is required.");
      return;
    }
    const duplicate = customers.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setNameError("A customer with this name already exists.");
      return;
    }
    addCustomerOnly(trimmed);
    setNewName("");
    setNameError("");
  }

  return (
    <div className="space-y-4">
      {/* Add Customer Form */}
      <form onSubmit={handleAdd} className="flex gap-2 items-start">
        <div className="flex-1 space-y-1">
          <div className="relative">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Add new customer name..."
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError("");
              }}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-card border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
                nameError ? "border-red-500" : "border-border"
              }`}
              data-ocid="customer_directory.input"
            />
          </div>
          {nameError && (
            <p
              className="text-xs text-red-400"
              data-ocid="customer_directory.error_state"
            >
              {nameError}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            color: "#fff",
          }}
          data-ocid="customer_directory.primary_button"
        >
          <UserPlus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search directory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          data-ocid="customer_directory.search_input"
        />
      </div>

      {/* Count indicator */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {customers.length} customer
        {customers.length !== 1 ? "s" : ""}
      </p>

      {/* Customer List */}
      {customers.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center border border-border"
          style={{ backgroundColor: "var(--card)" }}
          data-ocid="customer_directory.empty_state"
        >
          <Users
            className="w-10 h-10 mx-auto mb-2"
            style={{ color: "#334155" }}
          />
          <p className="text-sm font-semibold text-foreground mb-1">
            Directory is empty
          </p>
          <p className="text-xs text-muted-foreground">
            Add a customer using the form above.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl p-6 text-center border border-border"
          style={{ backgroundColor: "var(--card)" }}
          data-ocid="customer_directory.search.empty_state"
        >
          <p className="text-sm text-muted-foreground">
            No customers match &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <ul className="space-y-2" data-ocid="customer_directory.list">
          {filtered.map((customer, idx) => (
            <li
              key={customer.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
              data-ocid={`customer_directory.item.${idx + 1}`}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{
                  background: customer.isAtRisk
                    ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
                    : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + badge */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {customer.name}
                </span>
                {customer.isAtRisk && (
                  <ShieldAlert
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "#EF4444" }}
                  />
                )}
              </div>

              {/* Invoice count badge */}
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                style={{ backgroundColor: "#1E3A5F", color: "#60A5FA" }}
              >
                {customer.purchaseHistory.length} invoice
                {customer.purchaseHistory.length !== 1 ? "s" : ""}
              </span>

              {/* Delete */}
              <button
                type="button"
                onClick={() => deleteCustomer(customer.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-950/30 transition-colors"
                aria-label={`Delete ${customer.name}`}
                data-ocid={`customer_directory.delete_button.${idx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

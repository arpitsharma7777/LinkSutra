import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export function FormProvider({ children }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("🔗");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const value = {
    showAddForm,
    setShowAddForm,
    newTitle,
    setNewTitle,
    newUrl,
    setNewUrl,
    newIcon,
    setNewIcon,
    editingId,
    setEditingId,
    editTitle,
    setEditTitle,
    editUrl,
    setEditUrl,
    editIcon,
    setEditIcon,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within FormProvider");
  }
  return context;
}

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setDocuments([data, ...documents]);
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 Sistema Insular</h1>

      <input type="file" onChange={handleUpload} className="mb-4" />

      <input
        type="text"
        placeholder="Filtrar por nombre o tipo"
        className="border p-2 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Fecha</th>
            <th className="p-2">Descargar</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocs.map((doc, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{doc.emoji}</td>
              <td className="p-2">{doc.name}</td>
              <td className="p-2">{doc.date}</td>
              <td className="p-2 text-center">
                <a href={doc.url} download className="text-blue-600 underline">⬇️</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
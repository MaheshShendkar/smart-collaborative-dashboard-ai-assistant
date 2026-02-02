


import { useEffect, useState } from "react";
import api from "@/api/axios";
import "./FileAttachments.css"; // Import the CSS file

export default function FileAttachments({ projectId }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/projects/${projectId}/files`);
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      alert("Failed to load files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post(`/projects/${projectId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.querySelector('.file-input');
      if (fileInput) fileInput.value = '';
      
      await fetchFiles();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const res = await api.get(`/projects/${projectId}/files/${fileId}/download`, {
        responseType: "blob",
      });

      // Create a temporary URL for the downloaded blob
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set the filename using the parameter passed to the function
      link.setAttribute("download", filename);

      // Append the link to the body and trigger the click event to start the download
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the temporary URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
      alert("An error occurred while downloading the file.");
    }
  };

  const handleDelete = async (fileId) => {
    // Add confirmation dialog
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}/files/${fileId}`);
      await fetchFiles();
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const formatFileSize = (sizeInBytes) => {
    const sizeInKB = (sizeInBytes / 1024).toFixed(1);
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    }
    const sizeInMB = (sizeInKB / 1024).toFixed(1);
    return `${sizeInMB} MB`;
  };

  return (
    <div className={`file-attachments-container ${isLoading ? 'loading' : ''}`}>
      {/* Header */}
      <div className="file-attachments-header">
        <h3 className="file-attachments-title">
          📂 Project Files
        </h3>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="file-upload-form">
        <div className="file-upload-controls">
          <input
            type="file"
            className="file-input"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="upload-button"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {selectedFile && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </form>

      {/* Files List */}
      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <div className="empty-state-text">No files uploaded yet</div>
        </div>
      ) : (
        <ul className="files-list">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              <div className="file-info">
                <div className="file-details">
                  <div className="file-name">{file.filename}</div>
                  <div className="file-metadata">
                    <span className="file-size">
                      {formatFileSize(file.size)}
                    </span>
                    <span>•</span>
                    <span className="file-uploader">
                      Uploaded by {file.uploadedBy?.name || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    className="action-button download-button"
                    onClick={() => handleDownload(file._id, file.filename)}
                    disabled={isLoading}
                  >
                    Download
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(file._id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


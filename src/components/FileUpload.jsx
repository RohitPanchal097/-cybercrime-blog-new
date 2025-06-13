import React, { useState } from 'react';
import { uploadFile } from '../utils/back4app';
import { toast } from 'react-toastify';

const FileUpload = ({ onUploadSuccess, accept = 'image/*', maxSize = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (maxSize in MB)
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSize}MB`);
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    try {
      setUploading(true);
      const result = await uploadFile(file);
      onUploadSuccess(result);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          accept={accept}
          disabled={uploading}
        />
        {uploading && (
          <div className="mt-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Uploading...</span>
          </div>
        )}
      </div>
      
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="img-thumbnail" 
            style={{ maxHeight: '200px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload; 
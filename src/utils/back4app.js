import Parse from '../config/parse';

// Function to upload a file to Back4App
export const uploadFile = async (file, folder = 'uploads') => {
  try {
    // Create a unique filename using timestamp
    const fileName = `${Date.now()}_${file.name}`;
    const parseFile = new Parse.File(fileName, file);
    
    // Save the file
    await parseFile.save();
    
    // Return the file URL and name
    return {
      url: parseFile.url(),
      name: fileName
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to delete a file from Back4App
export const deleteFile = async (fileName) => {
  try {
    const parseFile = new Parse.File(fileName);
    await parseFile.destroy();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Function to get file metadata
export const getFileMetadata = async (fileName) => {
  try {
    const parseFile = new Parse.File(fileName);
    const metadata = await parseFile.fetch();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
}; 
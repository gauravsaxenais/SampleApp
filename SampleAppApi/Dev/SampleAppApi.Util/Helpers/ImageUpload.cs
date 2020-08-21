using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace SampleAppApi.Util.Helpers
{
  /// <summary>
  /// This class takes a Base64 encoded string 
  /// and saves the string as a byte[] to a user specified
  /// directory. The class also has exception handling 
  /// in place to check if its a valid base64 encoded string
  /// and has known file types (jpg, gif and png).
  /// The size of the file also should be less than 5 mb.
  /// </summary>
  public class ImageUpload : FileUpload
  {
	#region Constructors
	// default constructor
	public ImageUpload() : base() { }

	/// <summary>
	/// Constructor which initialises the object with FileAsBase64
	/// string.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	public ImageUpload(string fileAsBase64) : base(fileAsBase64) { }

	/// <summary>
	/// Constructor initialises the file, the root folder
	/// and the folder where the image is going to be stored.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	/// <param name="webPath"></param>
	/// <param name="folderName"></param>
	public ImageUpload(string fileAsBase64, string webPath, string folderName) : base(fileAsBase64, webPath, folderName) { }
	#endregion

	#region Public Methods
	public override Dictionary<string, string> GetKnownFileTypes()
	{
	  return new Dictionary<string, string>
	  {
	  { "image/jpg", "jpg" },
	  { "image/jpeg", "jpeg" },
	  { "image/png", "png" },
	  { "image/gif", "gif" }
	  };
	}

	/// <summary>
	/// Resizes an image with new width and height.
	/// </summary>
	/// <param name="byteImageIn">byte array</param>
	/// <param name="newWidth">new width</param>
	/// <param name="newHeight">new height</param>
	/// <returns></returns>
	public byte[] ResizeImage(byte[] byteImageIn, int maxContentWidth, int maxContentHeight)
	{
	  byte[] resizedImage;
	  MemoryStream inputMemoryStream = new MemoryStream(byteImageIn);

	  using (Image orginalImage = Image.FromStream(inputMemoryStream))
	  {
		ImageFormat orginalImageFormat = orginalImage.RawFormat;
		int orginalImageWidth = orginalImage.Width;
		int orginalImageHeight = orginalImage.Height;
		int resizedImageWidth = maxContentWidth; // Type here the width you want
		int resizedImageHeight = maxContentHeight;

		using (Bitmap bitmapResized = new Bitmap(orginalImage, resizedImageWidth, resizedImageHeight))
		{
		  using (MemoryStream streamResized = new MemoryStream())
		  {
			bitmapResized.Save(streamResized, orginalImageFormat);
			resizedImage = streamResized.ToArray();
		  }
		}
	  }
	  return resizedImage;
	}

	/// <summary>
	/// This method takes in a guid as parameter
	/// and creates a filename for the base64 encoded
	/// string and stores it into a directory.
	/// </summary>
	/// <param name="guid"></param>
	/// <returns></returns>
	public string WriteResizedFileToDirectory(Guid guid, int maxContentWidth, int maxContentHeight)
	{
	  string fullPath = string.Empty;
	  string newPath = string.Empty;
	  string fileExtension = string.Empty;

	  try
	  {
		newPath = Path.Combine(Directory.GetCurrentDirectory(), FolderName);
		fileExtension = GetFileExtension(FileAsBase64);

		if (!string.IsNullOrWhiteSpace(fileExtension))
		{
		  // strip off the file type from the fileData
		  string base64ByteArray = GetImageByteArray(FileAsBase64);

		  var fileName = $@"{guid}.{fileExtension}";

		  fullPath = Path.Combine(newPath, fileName);

		  // convert the file to binary
		  // store the file in the same way it was receieved from client
		  byte[] fileAsByteArray = Convert.FromBase64String(base64ByteArray);

		  // resize the image here
		  byte[] resizedByteArray = ResizeImage(fileAsByteArray, maxContentWidth, maxContentHeight);

		  // finally write the file to a disk
		  // Create a new FileStream object and pass the byte array to the Write() method of this method.
		  // Pass in a zero as the second parameter and the length of the byte array as the third parameter 
		  // so the complete file is written to disk.
		  using (var fs = new FileStream(
		   fullPath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
		  {
			fs.Write(resizedByteArray, 0,
					 resizedByteArray.Length);
		  }
		}
	  }
	  catch (Exception)
	  { }

	  return fullPath;
	}
	#endregion
  }
}


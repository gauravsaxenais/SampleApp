// <copyright file="ReadJsonFile.cs" company="SampleApp">
// Copyright (c) SampleApp. All rights reserved.
// </copyright>

using System;
using System.IO;

namespace SampleAppApi.UnitTest.Utility
{
	public static class ReadJsonFile
  {
	#region Public Methods
	public static string GetDataFromJsonFile(string filePath)
	{
	  string filepath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, filePath);
	  StreamReader streamReader = new StreamReader(filepath);
	  var jsonData = streamReader.ReadToEnd();
	  streamReader.Dispose();
	  return jsonData;
	}
	#endregion
  }
}

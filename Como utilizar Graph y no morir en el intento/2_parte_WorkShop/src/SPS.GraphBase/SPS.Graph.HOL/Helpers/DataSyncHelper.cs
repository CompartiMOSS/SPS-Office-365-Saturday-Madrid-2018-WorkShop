﻿namespace SPS.Graph.HOL.Helpers
{
    using SPS.Graph.HOL.ViewModels;
    using Newtonsoft.Json;
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Threading.Tasks;

    public class DataSyncHelper
    {
        public static async Task SaveSettingsInOneDrive(SettingsModel settingsModel)
        {
            throw new NotImplementedException();
        }

        public static async Task<SettingsModel> GetSettingsInOneDrive()
        {
            return new SettingsModel();
        }

        private static Stream GenerateStreamFromString(string s)
        {
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(s);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        private static string DeserializeFromStream(Stream stream)
        {
            StreamReader reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }
    }
}

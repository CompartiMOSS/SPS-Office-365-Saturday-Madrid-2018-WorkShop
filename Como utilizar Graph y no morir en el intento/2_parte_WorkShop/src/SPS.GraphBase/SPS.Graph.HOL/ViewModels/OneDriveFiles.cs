namespace SPS.Graph.HOL.ViewModels
{
    using Microsoft.Graph;
    public class OneDriveFiles
    {
        public string Name { get; set; }

        public string IconPath { get; set; }

        public DriveItem ItemInDrive { get; set; }
    }
}

﻿// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238
namespace SPS.Graph.HOL
{
    using SPS.Graph.HOL.Utils;
    using System;
    using Windows.UI.Xaml;
    using Windows.UI.Xaml.Controls;

    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ActivityGraph : Page
    {
        public ActivityGraph()
        {
            this.InitializeComponent();
        }

        private async void Button_Activity_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Progress.IsActive = true;
                await UserExtensionHelper.CreateActivity();
                InfoText.Text = $"Activity Created see Timeline";
            }
            catch (Exception ex)
            {
                InfoText.Text = $"OOPS! An error ocurred: {ex.GetMessage()}";
            }
            finally
            {
                Progress.IsActive = false;
            }
        }
    }
}

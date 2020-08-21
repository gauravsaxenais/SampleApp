using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class TouchConfig
    {
        public int JobId { get; set; }
        public int LayoutId { get; set; }
        public byte KeyboardSize { get; set; }
        public int ThemeId { get; set; }
        public string MainVideoUrl { get; set; }
        public string HelpVideoUrl { get; set; }
        public string TopBannerTitle { get; set; }
        public string TopFlashUrl { get; set; }
        public byte TopFlashSize { get; set; }
        public string BottomFlashUrl { get; set; }
        public byte BottomFlashSize { get; set; }
        public bool? ShowBottomFlash { get; set; }
        public int Contrast { get; set; }
        public int SpeakerVolume { get; set; }
        public string LogoUrl { get; set; }
        public bool? ShowClock { get; set; }
        public bool? ShowDate { get; set; }
        public bool ScrollByPage { get; set; }
        public bool KeyboardVoice { get; set; }
        public bool? VoicePrompt { get; set; }
        public string EmailSmtpserver { get; set; }
        public string EmailUserName { get; set; }
        public string EmailUserPassword { get; set; }
        public string EmailSenderAddress { get; set; }
        public byte EmailMaxVoiceTime { get; set; }
        public bool? ShowTopFlash { get; set; }
        public bool ShowDialCodeCol { get; set; }
        public int ScreenSaverTimeout { get; set; }
        public string ScreenSaverUrl { get; set; }
        public byte PanelAddress { get; set; }
        public byte LogoSize { get; set; }
        public bool UseLongName { get; set; }
        public bool MainAdEnabled { get; set; }
        public bool? ShowMainVideo { get; set; }
        public bool? ShowHelpVideo { get; set; }
        public bool ShowScreenSaver { get; set; }
        public bool BotAdEnabled { get; set; }
        public bool SaverAdEnabled { get; set; }
        public byte MainFlashSize { get; set; }
        public byte ScreenSaverFlashSize { get; set; }
        public int MediaVolume { get; set; }
        public int EventVolume { get; set; }
        public int ButtonPressVolume { get; set; }
        public int BackgroundMusicVolume { get; set; }
        public int MainVideoVolume { get; set; }
        public int BottomVideoVolume { get; set; }
        public int SaverVideoVolume { get; set; }
        public int HelpVideoVolume { get; set; }
        public byte[] RowVersion { get; set; }
        public int MainVideoFileId { get; set; }
        public int HelpVideoFileId { get; set; }
        public int TopFlashFileId { get; set; }
        public int BottomFlashFileId { get; set; }
        public int ScreenSaverFileId { get; set; }
        public int PanelId { get; set; }
        public bool EnableVideoCall { get; set; }
        public bool AutoGet { get; set; }
        public string AdminPassword { get; set; }
        public bool Ipcorrelations { get; set; }
        public string Sipserver { get; set; }
        public string SipuserId { get; set; }
        public string Sippassword { get; set; }
        public string Sipdisplayname { get; set; }
        public bool? AutoHalfDuplex { get; set; }
        public bool PushToTalk { get; set; }
        public string CloudServer1 { get; set; }
        public string CloudServer2 { get; set; }
        public string CloudUsername { get; set; }
        public string CloudPassword { get; set; }
        public string CloudDisplayName { get; set; }
        public bool? CloudKeepSignIn { get; set; }
        public Guid? CloudJobGuid { get; set; }
        public string SipproxyServer { get; set; }
        public string SipauthId { get; set; }
        public byte Sipcompatability { get; set; }
        public bool EncryptCorrMsg { get; set; }

        public virtual Panels Panels { get; set; }
    }
}

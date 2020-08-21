//   ************************************************************************
//   **            Company Confidential - For Internal Use Only            **
//   **          Mircom Technologies Ltd. & Affiliates ("Mircom")          **
//   **                                                                    **
//   **   This information is confidential and the exclusive property of   **
//   ** Mircom.  It is intended for internal use and only for the purposes **
//   **   provided,  and may not be disclosed to any third party without   **
//   **                prior written permission from Mircom.               **
//   **                                                                    **
//   **                        Copyright 2008-2010                         **
//   ************************************************************************
//
//
//  Revision History
//  ----------------
//
//   Z. Fung  2009-07-15 - Original
//   Z. Fung  2010-02-18 - APOptions: Add Ignore Facility code
//   Z. Fung  2010-07-08 - Allow 0 as keyless entry code
//   A. Gill  2010-09-07 - Added TouchMediaFormType
//   A. Gill  2010-10-22 - Added ButtonMode, MAX_RES_GROUPS
//   A. Gill  2010-10-29 - Added  MAX_LANGUAGES, MAX_ENABLED_LANGUAGES 
//   A. Gill  2010-11-18 - Added enum WindowID
//   V. Yang  2017-12-19 - Added MAX_UDP_ENCRYPTION_GRACE_TIME
//  
//  Description
//  -----------
//
//  See class summary and descriptions
//

using System;
using System.Runtime.InteropServices;
using MircomApi.Entities;

namespace MircomApi.Util.Helpers
{

  public static class Constants
  {
	public static class Strings
	{
	  public static class JwtClaimIdentifiers
	  {
		#region Public Variables
		public const string Name = "Name", UserId = "UserId";
		#endregion
	  }

	  public static class ApplicationWideConstants
	  {
		#region Public Variables
		public const string ApplicationName = "MircomApi";
		#endregion
	  }
	}

	public static readonly Version MIN_512K_FW_VERSION = new Version(3, 0);
	public const int CMDID_READDATA = 0x01;
	public const int CMDID_WRITEDATA = 0x02;
	public const int CMDID_READLOG = 0x03;
	public const int CMDID_COMMAND = 0x04;
	public const int CMDID_ENTER_CFG_MODE = 0x05;
	public const int CMDID_EXIT_CFG_MODE = 0x06;
	public const int CMDID_SEND_FIRMWARE = 0x07;
	public const int CMDID_CONNECT_PORT = 0x20;	
  }

  /// <summary>
  /// Enums class to provide enums for MIRCOM project
  /// </summary>
  public class Enums
  {

	public enum ProductType
	{
	  INVALID = 0,
	  LOBBY_UNIT = 1,
	  CARD_ACCESS = 2,
	  ELEVATOR = 3,
	  ASSA_ABLOY = 4,
	  BACNET = 5,
	  NANO = 8,
	  ALL = 255,
	}

	// The corresponding string resource is S_MODELS.
	public enum ProductModel
	{
	  INVALID = 0x00,
	  TX3_200_LCD4 = 0x01,
	  TX3_200_LCD8 = 0x02,
	  TX3_1000_LCD8 = 0x03,
	  TX3_2000_LCD8 = 0x04,
	  TX3_1000_LCD4 = 0x05,
	  TX3_2000_LCD4 = 0x06,
	  TX3_EMER_200KS = 0x07,
	  TX3_EMER_1S = 0x08,
	  TX3_CX_1DOOR = 0x20,
	  TX3_CX_2DOOR = 0x21, // 33
	  TX3_ASSA = 0x22, // 34
	  TX3_ELEVATOR = 0x41, // 65 96-relay model
	  TX3_TOUCH = 0x50, // 80
	  TX3_SYSTEM = 0x51, // 81
	  MODEL_ID_BACNET_GATEWAY = 0x23, // 35
	  TX3_NANO = 0x81,
	}

	public enum TreeType
	{
	  CONFIG = 0,
	  ONLINE = 1,
	  TOUCH = 2,
	}

	// The corresponding string resource is S_TREE_NODE_NAMES. 
	// The tree icon indices also follow the same definitions.
	public enum TreeNodeType : byte
	{
	  // Category level tree nodes
	  ROOT = 0,
	  NETWORK = 1,
	  RESIDENTS = 2,
	  CARDS = 3,
	  ACCESS_LEVELS = 4,
	  SCHEDULES = 5,
	  HOLIDAYS = 6,
	  NETWORK_STATUS = 7,
	  ACCESS_POINT_STATUS = 8,
	  TOUCHSCREEN = 9,     // Keep for backwords compatibility


	  // Panel level tree nodes
	  PANEL_GENERIC = 20,
	  PANEL_LOBBY_200_LCD8 = 21,
	  PANEL_LOBBY_200_LCD4 = 22,
	  PANEL_LOBBY_1000_LCD8 = 23,
	  PANEL_LOBBY_2000_LCD8 = 24,
	  PANEL_CX_2DOOR = 25,
	  PANEL_ELEVATOR = 26,
	  PANEL_LOBBY_1000_LCD4 = 27,
	  PANEL_LOBBY_2000_LCD4 = 28,
	  PANEL_CX_1DOOR = 29,
	  PANEL_TOUCH_SCREEN = 30,
	  PANEL_ASSA_ABLOY = 31,
	  PANEL_EMER_200KS = 32,
	  PANEL_EMER_1S = 33,
	  PANEL_BACNET_GATEWAY = 34,
	  PANEL_END = 100,

	  // Component level tree nodes
	  IO_CORRELATION = 10,
	  ACCESS_POINTS = 11,
	  CARD_READER = 12,
	  INPUTS_OUTPUTS = 13,
	  CORRELATIONS = 14,
	  RS485_LINK = 18,
	  TOUCH_SCREEN = 19,

	  // Continue of Category level tree nodes (ran out of space)
	  ELEVATOR_GROUPS = 101, //??
	  CAMERAS = 102,
	}

	public enum AssaAbloyLockType
	{
	  UNKNOWN = 0x00,
	  PR100 = 0x01,
	  IN100 = 0x02,
	  A100 = 0x03,
	  K100 = 0x04,
	  M100 = 0x05,
	  R100 = 0x06,
	  KS100 = 0x07,
	  L100_AL500 = 0x08,
	  AS100 = 0x09
	}


	// Input assignment types
	public enum InputAssignmentType : byte
	{
	  READERA_DC = 0,
	  READERB_DC = 1,
	  READERA_RTE = 2,
	  READERB_RTE = 3,
	  CAS_GENERAL_INPUT = 4,
	  POSTAL_LOCK = 0,
	  FIRE_ALARM_OVERRIDE = 1,
	  DOOR_CONTACT = 2,
	  TAS_GENERAL_INPUT = 3,
	  GENERAL_DOOR_STATUS = 35,
	}

	// Output assignment types
	public enum OutputAssignmentType : byte
	{
	  READERA_LOCK = 5,
	  READERB_LOCK = 6,
	  READERA_HANDICAP = 7,
	  READERB_HANDICAP = 8,
	  CAS_GENERAL_OUTPUT = 9,
	  MAIN_DOOR_LOCK = 5,
	  AUX_DOOR_LOCK = 6,
	  TAS_GENERAL_OUTPUT = 7,
	}

	// Active states
	public enum InputState : byte
	{
	  OPEN = 0,
	  CLOSE = 1,
	}

	// Output states
	public enum OutputState : byte
	{
	  Energized = 0,
	  Deenergized = 1,
	}


	// Supvervision
	public enum SupervisionType : byte
	{
	  NONE = 0,
	  SHORT_CIRCUIT = 1,
	  OPEN_CIRCUIT = 2,
	  OPEN_SHORT_CIRCUIT = 3,
	}


	
	// Input output types
	public enum IOCircuits : byte
	{
	  // TAS_LOBBY Inputs
	  TAS_INPUT1 = 0,
	  TAS_INPUT2 = 1,
	  TAS_INPUT3 = 2,
	  TAS_INPUT4 = 3,
	  TAS_INPUT5 = 4,

	  // CAS Inputs
	  CAS_INPUT1 = 0,
	  CAS_INPUT2 = 1,
	  CAS_INPUT3 = 2,
	  CAS_INPUT4 = 3,
	  CAS_INPUT5 = 4,
	  CAS_INPUT6 = 5,
	  CAS_INPUT7 = 6,
	  CAS_INPUT8 = 7,

	  // TAS_LOBBY Outputs
	  TAS_OUTPUT_OFFSET = 100,
	  TAS_OUTPUT1 = 100,
	  TAS_OUTPUT2 = 101,
	  TAS_OUTPUT3 = 102,
	  TAS_OUTPUT4 = 103,

	  // CAS Outputs
	  CAS_OUTPUT_OFFSET = 100,
	  CAS_OUTPUT1 = 100,
	  CAS_OUTPUT2 = 101,
	  CAS_OUTPUT3 = 102,
	  CAS_OUTPUT4 = 103,
	  CAS_OUTPUT5 = 104,
	  CAS_OUTPUT6 = 105,
	  CAS_OUTPUT7 = 106,
	  CAS_OUTPUT8 = 107,
	}


	// Event types 
	public enum EventType : int
	{
	  // Events generated by a CAS panel
	  INVALID_EVENT = 0,  // This event data is not defined or not processed
	  ACCESS_DENIED = 1,
	  ACCESS_GRANTED = 2,
	  DOOR_NOT_OPEN = 3,
	  FORCED_ENTRY = 4,
	  REQUEST_TO_EXIT = 5,
	  UNKNOWN_FORMAT = 6,
	  PC_DECISION_REQ = 7,
	  TROUBLE = 8,
	  DOOR_OPEN_ALARM = 9,
	  DOOR_OPEN_WARN = 10,
	  INPUT_ACTIVE = 11,
	  CARD_SWIPED = 12,
	  UNLOCK_MODE_ON = 13,
	  UNLOCK_MODE_OFF = 14,
	  HSEC_MODE_ON = 15,
	  HSEC_MODE_OFF = 16,
	  FORCED_ENTRY_REST = 17,
	  DOOR_OPEN_WARN_REST = 18,
	  DOOR_OPEN_ALARM_REST = 19,

	  //events generated by Assa Abloy panel
	  TAMPER = 20,
	  TAMPER_RESTORED = 21,
	  BATTERY_OK = 22,
	  BATTERY_LOW = 23,
	  BATTERY_FLAT = 24,
	  LOCKSET_OFFLINE = 25,
	  LOCKSET_ONLINE = 26,
	  LOCKSET_NOT_INITIALIZED = 27,
	  HANDLE_USED = 28,
	  HANDLE_NOT_USED = 29,
	  CAU_EVENT_DEADBOLT_LOCKED = 30,       // (Assa Abloy) deadbolt is locked  
	  CAU_EVENT_DEADBOLT_UNLOCKED = 31,     // (Assa Abloy) deadbolt is unlocked
	  ACCESS_DENIED_FC_NOT_MATCH = 32,      // (access denied because the facility code did not match)
	  ACCESS_DENIED_PIN_NOT_MATCH = 33,     // (pin did not match)
	  ACCESS_DENIED_PIN_TIMEOUT = 34,       // (pin code timer timed out)
	  ACCESS_DENIED_PIN_TOO_LONG = 35,      // (the entered pin code was too long)
	  ACCESS_DENIED_CARD_NOT_IN_DB = 36,    // (card code is not in the database)
	  ACCESS_DENIED_ZERO_USAGE_COUNT = 37,  // (temporary card reached zero usage count)
	  ACCESS_DENIED_CARD_NOT_ACTIVE = 38,   // (card is not active)
	  ACCESS_DENIED_ACT_DATE_NOT_MATCH = 39,// (activation date does not match)
	  ACCESS_DENIED_SCHEDULE_NOT_MATCH = 40,// (schedule does not match)
	  ACCESS_DENIED_HISEC_FEAT_OFF = 41,    // (the panel is in high security and the presented card does not have the high security feature turned on)
	  ACCESS_DENIED_IN_APB_LIST = 42,       // (the card is in the anti pass back list)
	  ACCESS_DENIED_APB_LIST_FULL = 43,     // (anti pass back list is full so the access is denied)
	  CAU_EVENT_HUB_ONLINE = 44,            // (Assa Abloy hub goes online)
	  CAU_EVENT_HUB_OFFLINE = 45,           // (Assa Abloy hub goes offline)
	  CAU_EVENT_ALL_HISEC_MODE_ON = 46,     //       
	  CAU_EVENT_ALL_HISEC_MODE_OFF = 47,    //
	  CAU_EVENT_KEY_CYL_USED = 48,          // (Assa Abloy cylinder used)        
	  CAU_EVENT_KEY_CYL_NOT_USED = 49,      // (Assa Abloy cylinder undone)        
	  CAU_EVENT_KEY_CYL_INSIDE = 50,        // (Assa Abloy cylinder used inside)        
	  CAU_EVENT_KEY_CYL_OUTSIDE = 51,       // (Assa Abloy cylinder used outside)        
	  CAU_EVENT_KEY_CYL_SIDE_BOTH = 52,     // (Assa Abloy) key cylinder is ussed on both sides)
	  CAU_EVENT_DEADBOLT_JAMMED = 53,       // (Assa Abloy) deadbolt jammed
	  CAU_EVENT_DEADBOLT_SECURED = 54,      // (Assa Abloy) deadbolt secured
	  CAU_INPUT_NORMAL = 55,
	  CAU_WIEGAND_PASSTHROUGH = 56,

	  // Events generated by a TAS_LOBBY panel
	  TAS_INPUT_ACTIVE = 100,
	  TAS_CALL_STARTED = 101,
	  TAS_CALL_FINISHED = 102,
	  TAS_CALL_CONNECTED = 103,
	  TAS_ACCESS_GRANTED = 104,
	  TAS_ACCESS_DENIED = 105,
	  TAS_SYS_NORMAL = 106,
	  TAS_UNLOCK_MODE_ON = 107,
	  TAS_UNLOCK_MODE_OFF = 108,
	  TAS_INPUT_NORMAL = 109,
	  TAS_DIAL_CODE_NOT_FOUND = 120,
	  TAS_CALL_SCH_INACTIVE = 121,
	  TAS_LINE_NOT_CONNECTED = 122,
	  TAS_LINE_IN_USE = 123,
	  TAS_UNUSED_LINE_SELECTED = 124,
	  TAS_GUARD_PHONE_CONNECTED = 125,
	  TAS_CALLING_GUARD_PHONE = 126,
	  TAS_CONFIGURATION_MODE = 127,
	  TAS_DISCONNECTING_CALL = 128,
	  TAS_DATABASE_EMPTY = 129,
	  TAS_KEYLESS_SCH_INACTIVE = 130,
	  TAS_KEYLESS_CODE_NOT_FOUND = 131,
	  TAS_MAIN_N_AUX_DOOR_OPEN = 132,
	  TAS_MAIN_DOOR_OPEN = 133,
	  TAS_AUX_DOOR_OPEN = 134,
	  TAS_CALLED_PARTY_BUSY = 135,
	  TAS_CALL_IN_PROCESS = 136,
	  TAS_GUARD_PHONE_NOT_CONN = 137,
	  TAS_NO_DIAL_TONE = 138,
	  TAS_GUARD_PHONE_CALLING = 139,
	  TAS_POSTAL_USAGE_EXCEEDED = 140,
	  TAS_UNLOCK_SCHEDULE_INACT = 141,

	  // Events generated by the CommServer
	  GENERAL = 200,
	  COMM_TASK_STATUS = 201,
	  COMM_DATA_CHANGED = 202,
	  ERROR = 203,
	  ABORT = 204,
	  COMM_STATUS_CHANGED = 205,

	  // Events generated by JobLoader
	  JOBLOADER_STATUS = 208,
	  CLEAR_STATUS = 209,
	  SET_FULL_PROGRESS = 210,
	  STEP_PROGRESS = 211,

	  // Events generated by Event Logger
	  LOGGER_STATUS = 214,
	  DUMMY_EVENT = 215,
	  SYSLOG_EVENT = 216,


	  // General Events generated by the configurator
	  OPERATOR_ACTIONS = 220,
	  TOUCH_TESTMODE_START = 221,
	  TOUCH_TESTMODE_END = 222,
	  TOUCH_CONFIG_EXIT = 223,
	  TOUCH_CONFIG_ENTER = 224,

	  FW_UPGRADE = 230,
	  FW_UPGRADE_ERROR = 231,
	  FW_UPGRADE_COMPLETE = 232,
	  FW_UPGRADE_CANCEL = 233,
	  FW_UPGRADE_PROGRESS = 234,
	  FW_UPGRADE_RESET = 235,
	  TOUCH_MESSAGE = 236,    // General message type for touch screen app. m_data1 is the real EventType
	  MESSAGING_CLIENT_CONNECT = 237,
	  SERVER_DB_CHANGED = 238,
	  SERVER_DB_CHANGED_COMPLETE = 239,
	  OFFLINE_ERROR = 240,
	  MESSAGING_CLIENT_DISCONNECT = 241, //m_msg is the client key, m_data1 is type DBChangedCompleteOption, m_data2 is model

	  //VOIP events
	  VOIP_CMD_CALL = 242,
	  VOIP_CMD_DISCONNECT = 243,
	  VOIP_CMD_INIT = 244,
	  VOIP_CMD_RESET = 245,
	  VOIP_INIT_SUCCESS = 246,
	  VOIP_CMD_SET_PARAM = 247,
	  VOIP_CMD_PUSH_TO_TALK = 248,

	  //Panel Status events
	  PANEL_OFFLINE = 249,
	  PANEL_CONNECTED = 250,
	  PANEL_CONNECT_ERROR = 251,
	  PANEL_STATUS_CHANGED = 252,
	  PANEL_NEWLY_REGISTERED = 253,

	  // Nework status events
	  NETWORK_CONNECTING = 254,     //m_data2 is the network ID
	  NETWORK_DISCONNECTED = 255,   //m_data2 is the network ID   

	  //Events created by RestoreBackup
	  RESTOREBACKUP_STATUS = 300,

	  // Events Created by AlertManger
	  ALERTMANAGER_STATUS = 301,

	  //Events created by auto backup
	  AUTOBACKUP_START = 302,
	  AUTOBACKUP_STATUS = 303,

	  // More VOIP events
	  VOIP_CMD_SHUTDOWN = 310,
	  VOIP_STATUS_INITIALIZING = 311,
	  VOIP_STATUS_INIT_FAILED = 312,
	  VOIP_STATUS_SHUTTING_DOWN = 313,
	  VOIP_STATUS_NOT_INITIALIZED = 314,
	  VOIP_CALL_NOT_ACCEPTED = 315,
	  VOIP_CALL_PARTY_NOT_FOUND = 316,
	  VOIP_CALL_ERROR = 317,

	  // System maintenace events
	  MAINTENANCE_MSG = 330,
	  MAINTENANCE_PROGRESS = 331,
	  MAINTENANCE_END = 332,
	  MAINTENANCE_EXIT_APP = 333,
	  MAINTENANCE_RESTART = 334,
	  MAINTENANCE_SHUTDOWN = 335,
	  MAINTENANCE_RESIZE = 336,
	  MAINTENANCE_REQ_RESET = 337,
	  MAINTENANCE_UPLOAD_LOGS = 338,
	  MAINTENANCE_LOGIN_PARAM = 339,
	  MAINTENANCE_REQ_LOGOUT = 340,

	  // USB port events
	  USB_PORT_RECONNECTED = 341,
	  USB_PORT_DISCONNECTED = 342,

	  // Extended maintenance events
	  MAINTENANCE_RESTART_APP = 360,

	  // Clock sync events
	  PANEL_CLOCK_SYNC = 370,

	  // Touch Correlation Message Time Out
	  TOUCH_CORRELATION_TIMEOUT = 380,

	  // Monitoring events
	  OBJECT_STATUS_CHANGED = 390,
	}


	public enum ResultID
	{ Success, Error, TimedOut, Aborted, };


	[Flags]
	public enum EventOption
	{
	  None = 0x00,
	  SaveToLog = 0x01,
	  ShowOnEventList = 0x02,
	  ShowOnStatusLabel = 0x04,
	  ShowOnProgressBar = 0x08,
	  UseTimeStamp = 0x10,
	  IsAlarm = 0x20,
	  IsWarning = 0x40,
	  ForwardToRemote = 0x80,    // Forward this event to remote client or server
	  ListAndLog = SaveToLog | ShowOnEventList,
	  StatusAndProgress = ShowOnStatusLabel | ShowOnProgressBar,
	}

	public enum PortTypes
	{
	  SERIAL = 0,
	  MODEM = 1,
	  TCP = 2,
	  USB = 3,
	}

	// Action types
	public enum ActionType : byte
	{
	  TURN_ON_OUTPUT = 0,
	  TURN_OFF_OUTPUT = 1,
	  TURN_ON_HI_SECU = 2,
	  TURN_OFF_HI_SECU = 3,
	  DIAL_NUMBER = 4,
	}


	// Communcation commands
	public enum CommCommand
	{
	  READDATA = 1,
	  WRITEDATA = 2,
	  READLOG = 3,
	  COMMAND = 4,
	  SEND_FIRMWARE = 7,
	  CONNECT_PORT = 8,
	}

	/*
	#define MSGTYPE_IPEVENT          1      // SENT TO FCU
	#define MSGTYPE_IPSTAT           2      // SENT TO FCU
	#define MSGTYPE_STATCHG          3      // SENT BY SCU TO ALL UNITS
	#define MSGTYPE_OPCTRL           4      // SENT BY FCU/CFU TO DRIVERS
	#define MSGTYPE_CKTRESET         5      // SENT FROM FCU TO ALL UNITS
	#define MSGTYPE_SYSRESET         6      // SYSTEM RESET
	#define MSGTYPE_STARTUP          7      // SYSTEM STARTUP
	#define MSGTYPE_TROUBLE          8      // SENT BY SPU FOR SYSTEM TROUBLES
	#define MSGTYPE_HEARTBEAT        9      // SENT BY SPU TO ALL UNITS
	#define MSGTYPE_TMREXPIRE       10      // SENT BY TMU TO OWNER OF TIMER
	#define MSGTYPE_TIMECHG         11      // SENT WHEN MINUTES ROLLED OVER OR TIME CHNGED
	#define MSGTYPE_CFG_UPDATED     12      // SENT BY CFU WHEN CONFIG TABLES CHANGED
	#define MSGTYPE_SYSUPDATE       13      // STATUS UPDATE REQUEST
	#define MSGTYPE_SETMODE         14      // CHANGE SYSTEM OPERATING MODE
	#define MSGTYPE_PSCD_CHGD       15      // PASSCODE UPDATED
	#define MSGTYPE_MANUALTEST      16      // PASSCODE UPDATED

	#define MSGTYPE_SETDATA_REQ	    19	    // SET CONFIG DATA REMOTELY
	#define MSGTYPE_GETDATA_REQ	    20	    // GET CONFIG DATA REMOTELY
	#define MSGTYPE_GET_GENLOG	    23	    // REPORT XX GEN LOGS TO REMOTE USER
	#define MSGTYPE_EXEC		        25	    // REMOTE COMMNAND TO BE EXECUTED
	#define MSGTYPE_GET_INFO	      26	    // GET THE SYSTEM INFO COMMAND
	#define MSGTYPE_CFG_CHANGED     27      // CONFIGURATION CHANGE SOURCE INFO
	#define MSGTYPE_SCHEDULE_CHGD   28      // SCHEDULE CHANGED
	#define MSGTYPE_REPORT_EVENT    29      // REPORT EVENT
	#define MSGTYPE_PC_DECISION_REQ 30      // PC decision required


	//
	#define MSGTYPE_BLOCKING_START       128  // FOR BLOCKING MESSAGES

	#define MSGTYPE_SETDATA              128  // SET CONFIG DATA STRUCTURE
	#define MSGTYPE_GETDATA              129  // GET CONFIG DATA STRUCTURE
	#define MSGTYPE_SET_CMD_DATA         130  // SENT BY CMD TO CFU/FCU TO TRANSMIT COMMANDS
	#define MSGTYPE_GET_CMD_DATA         131  // SENT BY CMD TO CFU/FCU TO OBTAIN MENU CHECKLIST
	#define MSGTYPE_CONNECT              132  // SENT BY RCU TO CFU/FCU TO REQUEST 

	#define MSGTYPE_GET_RESIDENT_REC     133  // GET RESIDENT RECORD
	#define MSGTYPE_SET_RESIDENT_REC     134  // SET RESIDENT RECORD
	#define MSGTYPE_GET_CARD_ACC_REC     135  // GET CARD ACCESS RECORD
	#define MSGTYPE_SET_CARD_ACC_REC     136  // SET CARD ACCESS RECORD
	#define MSGTYPE_GET_LOGS  	         137  // REPORT LOGS TO REMOTE USER
	#define MSGTYPE_GET_LOGINFO	         138  // REPORT LOGS STATISTICS TO REMOTE USER  
	#define MSGTYPE_SET_TIME_DATE        139  // SET TIME AND DATE
	#define MSGTYPE_GET_TIME_DATE        140  // GET TIME AND DATE
	#define MSGTYPE_DELETE_LOGS          141  // DELETE LOGS
	#define MSGTYPE_LOGIN		             142  // SENT BY REMOTE USER TO LOGIN
	#define MSGTYPE_CMD_ACCPT_CTRL       143  // SEND COMMAND TO CONTROL THE ACCPT
	#define MSGTYPE_GET_STRUC_INFO       144  // SEND GET STRUCTURE INFO
	#define MSGTYPE_GET_RECORD_INFO      145  // SEND GET RECORD INFO
	#define MSGTYPE_CFG_REQ		           146  // CHANGE CONFIGURATION REMOTE REQUEST
	#define MSGTYPE_LOGOUT		           147  // SENT BY REMOTE USER TO LOGOUT
	*/

	// Communication message type
	public enum CommMsgType : byte
	{
	  INVALID = 0,
	  IPEVENT = 1,    // SENT TO FCU
	  IPSTAT = 2,    // SENT TO FCU
	  STATCHG = 3,    // SENT BY SCU TO ALL UNITS
	  OPCTRL = 4,    // SENT BY FCU/CFU TO DRIVERS
	  CKTRESET = 5,    // SENT FROM FCU TO ALL UNITS
	  SYSRESET = 6,    // SYSTEM RESET
	  STARTUP = 7,    // SYSTEM STARTUP
	  TROUBLE = 8,    // SENT BY SPU FOR SYSTEM TROUBLES
	  HEARTBEAT = 9,    // SENT BY SPU TO ALL UNITS
	  TMREXPIRE = 10,    // SENT BY TMU TO OWNER OF TIMER
	  TIMECHG = 11,    // SENT WHEN MINUTES ROLLED OVER OR TIME CHNGED
	  CFG_UPDATED = 12,    // SENT BY CFU WHEN CONFIG TABLES CHANGED
	  SYSUPDATE = 13,    // STATUS UPDATE REQUEST
	  SETMODE = 14,    // CHANGE SYSTEM OPERATING MODE
	  PSCD_CHGD = 15,    // PASSCODE UPDATED
	  MANUALTEST = 16,    // PASSCODE UPDATED
	  SETDATA_REQ = 19,    // SET CONFIG DATA REMOTELY
	  GETDATA_REQ = 20,    // GET CONFIG DATA REMOTELY
	  SEND_CORR_INFO = 21,    // REPORT LOGS STATISTICS TO REMOTE USER  
	  GET_GENLOG = 23,    // REPORT XX GEN LOGS TO REMOTE USER
	  EXEC = 25,      // ?REMOTE COMMNAND TO BE EXECUTED
	  GET_INFO = 26,      // ?GET THE SYSTEM INFO COMMAND
	  CFG_CHANGED = 27,    // CONFIGURATION CHANGE SOURCE INFO
	  SCHEDULE_CHGD = 28,    // SCHEDULE CHANGED
	  REPORT_EVENT = 29,    // REPORT EVENT
	  PC_DECISION_REQ = 30,    // PC decision required
	  PC_COMMAND = 31,    // PC command
	  ELEV_CTRL = 32,    // Elevator control
	  IP_SEND = 33,    // IP Send
	  IP_REQUEST = 34,    // IP Request
	  IP_DISCOVERY = 38,    // IP Discovery "ping"
	  ELEV_CTRL_IP_ADDR = 39,    // Elevator control via IP


	  SETDATA = 128,   // SET CONFIG DATA STRUCTURE
	  GETDATA = 129,   // GET CONFIG DATA STRUCTURE
	  SET_CMD_DATA = 130,   // SENT BY CMD TO CFU/FCU TO TRANSMIT COMMANDS
	  GET_CMD_DATA = 131,   // SENT BY CMD TO CFU/FCU TO OBTAIN MENU CHECKLIST
	  CONNECT = 132,   // SENT BY RCU TO CFU/FCU TO REQUEST 
	  GET_RESIDENT_REC = 133,   // GET RESIDENT RECORD
	  SET_RESIDENT_REC = 134,   // SET RESIDENT RECORD
	  GET_CARD_ACC_REC = 135,   // GET CARD ACCESS RECORD
	  SET_CARD_ACC_REC = 136,   // SET CARD ACCESS RECORD
	  GET_LOGS = 137,   // REPORT LOGS TO REMOTE USER
	  LOGINFO = 138,   // ?REPORT LOGS STATISTICS TO REMOTE USER  
	  SET_TIME_DATE = 139,   // ?SET TIME AND DATE
	  GET_TIME_DATE = 140,   // ?GET TIME AND DATE
	  DELETE_LOGS = 141,   // DELETE LOGS
	  LOGIN = 142,   // SENT BY REMOTE USER TO LOGIN
	  CMD_ACCPT_CTRL = 143,   // SEND COMMAND TO CONTROL THE ACCPT
	  GET_STRUC_INFO = 144,   // SEND GET STRUCTURE INFO
	  GET_RECORD_INFO = 145,   // SEND GET RECORD INFO
	  CFG_REQ = 146,   // CHANGE CONFIGURATION REMOTE REQUEST
	  LOGOUT = 147,   // SENT BY REMOTE USER TO LOGOUT
	  GET_STATUS_INFO = 148,   // SEND BY REMOTE TO GET SYSTEM STATUS
	  FW_CMD = 149,   // NETWORK FIRMWARE UPGRADE COMMAND
	  FW_DATA = 150,   // FIRMWARE UPDATE DATA 
	  GET_HUB_REV = 151,   // ASSAY ABLOY HUB UPDATE DATA
	}



	// Panel Online Status
	public enum PanelOnlineStatus
	{
	  Offline,
	  Online,
	}


	// Panel modes
	[Flags]
	public enum PanelModes : byte
	{
	  None = 0x00,  // Initial state
	  Online = 0x01,  // Panel is online
	  Connected = 0x02,  // Panel is logged in and connected
	  InConfigMode = 0x04,  // Panel is in config mode
	  Alarmed = 0x08,  // Panel has an alarm
	  Troubled = 0x10,  // Panel has a trouble
	  UpgradingFW = 0x20,  // Panel firmware is being upgraded
	}

	// Touch UI layout types
	public enum TouchUILayout
	{
	  Layout_1 = 1,
	  Layout_2 = 2,
	  Layout_3 = 3,
	  Layout_4 = 4,
	}


	// Constants 
	public enum Const : int
	{
	  MIN_ADDRESS = 1,
	  MAX_ADDRESS = 63,
	  ASSA_INVALID_ADDRESS = 0,

	  MINLEN_RESIDENT_NAME = 1,
	  MAXLEN_RESIDENT_NAME = 15,
	  MAXLEN_RESIDENT_LONGNAME = 60,

	  MINLEN_RESIDENT_APTNUM = 1,
	  MAXLEN_RESIDENT_APTNUM = 8,

	  MINLEN_PROFILE_ADDRESS = 1,
	  MAXLEN_PROFILE_ADDRESS = 100,

	  MINLEN_PROFILE_EMAIL = 1,
	  MAXLEN_PROFILE_EMAIL = 50,

	  MAXLEN_SIPUSERNAME = 30,
	  MINLEN_SIPUSERNAME = 1,

	  MAXLEN_CARDNAME = 50,  //original 27
	  MAXLEN_CARDNUMBER = 10,
	  MAXLEN_CARDADDRESS = 100,
	  MINLEN_CARDNAME = 1,

	  MIN_DIALCODE = 1,
	  MAX_DIALCODE = 9999,
	  MAX_USER_DIALCODE = 9990,

	  MIN_RELAYCODE = 1,
	  MAX_RELAYCODE = 1536,

	  MIN_KEYLESSCODE = 0,
	  MAX_KEYLESSCODE = 999999,

	  MIN_PASSCODE = 1,
	  MAX_PASSCODE = -1,

	  MIN_ELEV_RELAYCODE = 1,
	  MAX_ELEV_RELAYCODE = 96,

	  MIN_APT_NUM = 0,
	  MAX_APT_NUM = 8,

	  MAX_RES_200 = 210,
	  MAX_RES_1000 = 1020,
	  MAX_RES_2000 = 2040,
	  MAX_CARDS = 5000,   // FW < 3.4
	  MAX_CARDS2 = 7500,  // FW >= 3.4
	  MAX_CARDS3 = 15000, // ASSB >= 3.2.16

	  MIN_TREEPOS_PANEL = 21,
	  MIN_TREEPOS_COMPONENT = 200,
	  MIN_TREEPOS_ASSA_AP = 100,

	  MAX_MSGLEN_LCD4 = 20,

	  MAX_PHONENUM_LEN = 18,

	  MAX_INPUTS_CAS101 = 4,
	  MAX_OUTPUTS_CAS101 = 3,
	  MAX_INPUTS_CAS102 = 8,
	  MAX_OUTPUTS_CAS102 = 8,
	  MAX_INPUTS_LOBBY = 5,
	  MAX_OUTPUTS_LOBBY = 4,
	  MAX_INPUTS_ASSA = 8,
	  MAX_OUTPUTS_ASSA = 8,
	  MAX_ACCESS_POINTS_ASSA = 32,
	  MAX_ACCESS_POINTS_ASSA3 = 16,
	  MAX_ALLOW_ACCESS_POINTS_ASSA = 16, // limit specifically for GUI
	  MAX_LOCKSETS_PER_HUB = 8,
	  MIN_ASSA_HUB_ADDRESS = 1,
	  MAX_ASSA_HUB_ADDRESS = 15,
	  MIN_ASSA_LOCK_ADDRESS = 0,
	  MAX_ASSA_LOCK_ADDRESS = 7,
	  MAX_NUM_HUBS = 16,

	  MAX_SCHEDULES = 64,
	  MAX_HOLIDAYS = 128,
	  MAX_LANGUAGES = 5,
	  MAX_ENABLED_LANGUAGES = 3,
	  MAX_ACCESS_LEVELS = 32,
	  MAX_ACCESS_LEVELS2 = 128,

	  ACCESS_LEVEL_ADMIN = 0,
	  ACCESS_LEVEL_NOTUSED = 0x0000FFFF,
	  ACCESS_LEVEL_MIXED_VALUES = 0x0FFFFFFF,

	  SCHEDULE_ALWAYS = 0,
	  SCHEDULE_NEVER = 1,

	  READER_A_ID = 0,
	  READER_B_ID = 1,

	  MAX_PERIODS_OLD = 4,
	  MAX_PERIODS = 8,

	  MAX_PHONE_LINES = 5,   // Max phone lines on a TAS_LOBBY lobby unit
	  MAX_ACCESS_LEVELS_PER_CARD = 3, // Max access level per card
	  MAX_PASSCODES = 3,    // Max passcodes on a panel

	  DEF_PASSCODE_BASE = 1111,  // Default Level 1 passcode

	  MSGRAW_HEADER_SIZE = 9,
	  MSGRAW_DATA_SIZE = 20,

	  PC_ADDR = 254,
	  BROADCAST_ADDR = 0,

	  MAX_COMM_PAYLOAD_LEN = 200,
	  MAX_COMM_PAYLOAD_LEN_RCV = 300,
	  DEF_COMM_TASK_TIMEOUT = 30000,   // Normal time to wait for a task to complete
	  MAX_COMM_TASK_TIMEOUT = 800000,  // Max time to wait for a task to complete

	  // SERIAL PORT DEFAULT
	  DEF_RS232_BAUD = 115200,
	  DEF_READ_TIMEOUT = 300,
	  DEF_WRITE_TIMEOUT = 1000,

	  // NETWORK COMM DEFAULT
	  DEF_MAX_RETRIES = 2,
	  DEF_RETRY_TIMEOUT = 1000,
	  EXTENDED_RETRY_TIMEOUT = 3000,

	  // MODEM PORT DEFAULT
	  DEF_MODEM_BAUD = 33600,

	  // TASK_IDs
	  TASK_TMU = 6,
	  TASK_CMD = 7,
	  TASK_TAU = 8,
	  TASK_CFU = 9,
	  TASK_SDU = 10,
	  TASK_NSL = 11,
	  TASK_ERU = 12,
	  TASK_CAU = 13,
	  TASK_SVU = 14,

	  // EVENT LOGS
	  MIN_LOG_INDEX = 0,
	  MAX_USER_LOG_INDEX = 5000,
	  MAX_SYS_LOG_INDEX = 5000,
	  AUTO_LOG_TIMER = 60, // sec
	  MAX_EVLOG_DATA = 20,   // Event log entry Data field size
	  MAX_MSG_HEADER = 9,    // Event log entry data msg header size
	  MAX_EVTLOG_DESC = 100, // Max length of event log description in database table

	  // MAX ENTRIES
	  MAX_VARIABLE_ARRAY = -1,
	  MAX_TMU_TIMER_INFO = 56,
	  MAX_CAU_ACCESS_POINTS = 2,
	  MAX_SINGLE_CAU_ACCESS_POINTS = 2,
	  MAX_CAU_INPUT_TYPES = 8,
	  MAX_CAU_OUTPUT_TYPES = 8,
	  MAX_TAU_LANGUAGES = 3,
	  MAX_TAU_LCD_LINES = 10,
	  MAX_TAU_MESSAGES = MAX_TAU_LANGUAGES * MAX_TAU_LCD_LINES,
	  MAX_ASSA_TIMER_COUNT = 8,

	  // CORR TIMERS
	  MAX_CAU_CORR_FIRMWARE_V23 = 32,
	  MAX_TAU_CORR_FIRMWARE_V23 = 32,
	  MAX_CAU_CORR = 16,
	  MAX_TAU_CORR = 8,
	  TAU_TIMER_MAIN_DOOR_OPEN = 0,
	  CAU_TIMER_OPEN_A = 3,
	  CAU_CORR_TIMER_BASE = 27,
	  TAU_CORR_TIMER_BASE = 43,

	  //FIRMWARE
	  MAX_FIRMWARE_COMMIT_TIMEOUT = 18000,
	  MAX_FIRMWARE_PACKET_SEND_TIMEOUT = 150,
	  PANEL_RESET_WAIT_TIME = 90000,
	  PANEL_GETIP_WAIT_TIME = 30000,
	  PANEL_REFRESH_VERSION_TIME = 2500,
	  MAX_ERASE_LOG_TIMEOUT = 15000,

	  // REPORTS
	  MAX_REPORT_ROW = 50000,

	  // Auto panel detect
	  MAX_AUTO_DETECT_TIMEOUT = 700,    //ms
	  MAX_AUTO_DETECT_RETRIES = 0,

	  // INCREMENTAL LOAD THRESHOLD
	  MAX_INCREMENTAL_CHANGES = 400,

	  // MAX COORELATION TIMER 
	  MAX_TAU_CORR_TIMER = 600,         //min
	  MAX_CAU_CORR_TIMER = 600,         //min
	  MAX_ASSA_CORR_TIMER = 600,        //min

	  // MAX ELEVATOR RELAYS 
	  MAX_ELEV_RELAY = 24,

	  // FACILITY CODE 
	  MIN_FACILITYCODE = 0,
	  MAX_FACILITYCODE = unchecked((int)4294967294),

	  // ELEVATOR TIMER
	  MIN_ELEV_ACTIVE_TIME = 5,
	  MAX_ELEV_ACTIVE_TIME = 600,

	  // RESIDENT GROUPS
	  MAX_RES_GROUPS = 7,

	  //ADVERTISING
	  MAX_ADV_PLAYLIST = 50,
	  MAX_ADV = 100,

	  //MAX VIDEO FILENAME LENGTH
	  MAX_FILENAME_LENGTH = 300,
	  //MAX VIDEO FILE SIZE
	  MAX_FILE_SIZE = 104857600,

	  // TOUCH SCREEN 
	  MAX_IDLE_BEFORE_CALL = 1,         //sec
	  MAX_IDLE_BEFORE_KEYLESS = 1,      //sec
	  MAX_DEFAULT_TALKTIME = 70,        //sec
	  DEFAULT_WAITTIME = 6,              //sec

	  // SECURE DTMF CODES
	  MIN_DTMF_PHONE_CODE = 0,
	  MAX_DTMF_PHONE_CODE = 9999,

	  // DTMF RX GAIN
	  DEF_DTMF_RXGAIN = 2048,     // 0x800 -4.5db

	  // TCP / UDP MASTER NODE COMMUNICATION PORTS
	  TCP_PORT = 14000,
	  UDP_IP_SEND_PORT = 14001,
	  UDP_IP_LISTEN_PORT = 14002,
	  UDP_PANEL_COMM_PORT = 14003,
	  PING_REPLY_TIMEOUT = 1000,
	  IP_DISCOVERY_TIMEOUT = 3000,
	  IP_ASSIGNMENT_WAIT = 2000,
	  TCP_CONNECT_TIMEOUT = 2000,
	  SSL_CONNECT_TIMEOUT = 15000,

	  // Custom Correlation contanst (CustomPanelID)
	  CUSTOM_ACTION_PANEL_ID = -1,  // This is a Custom correlation
	  CUSTOM_MASTER_BROADCAST = -2, // PanelID of broadcasting to all masters
	  CUSTOM_MASTER_NONE = -3,      // PanelID of not sending to any IP node
	  CUSTOM_485_NONE = 0xFF,       // No RS485 address means send only to master nodes
	  CUSTOM_NANO_PANEL_ID = -4,    // This is a Nano correlation

	  // MASTER NODE COMBO ON ADD PANEL FORM
	  ADD_PANEL_COMBO_MASTER_NODE = -1,
	  MASTER_NODE_FOR_USB_NETWORK = -1,
	  SET_MASTER_NODE_ID_LATER = -2,
	  INVALID_MASTER_NODE_ID = 0,

	  // DEFAULT VALUE FOR HANDSET NOT IMPLEMENTED
	  HANDSET_DEFAULT_OFF = 0,

	  // RESOLUTION AND SCALING COEFFICIENTS
	  MAIN_FORM_HEIGHT_LANDSCAPE = 69,
	  MAIN_FORM_HEIGHT_PORTRAIT = 80,
	  MAIN_FORM_SMALL_KEY_HOR = 75,
	  MAIN_FORM_SMALL_KEY_VER = 85,
	  MAIN_FORM_MIN_RESOLUTION_WIDTH = 1024,
	  MAIN_FORM_MIN_RESOLUTION_HEIGHT = 768,

	  // Touch screen health check constants
	  MAX_TOUCH_GDI = 2000,
	  WARN_TOUCH_MEMORY = 500,          // Mega bytes
	  MAX_TOUCH_MEMORY = 800,           // Mega bytes
	  MIN_VIRTUAL_MEMORY = 200,         // Mega bytes
	  WARN_VIRTUAL_MEMORY = 500,        // Mega bytes
	  TOUCH_HEALTHCHK_INTERVAL = 30,    // minutes 
	  TOUCH_RETRY_LOGIN_INTERNAL = 2,   // minutes
	  MAX_TOUCH_CONFIG_IDLE = 2,        // minutes
	  MAX_CHECK_DATA_CHANGED = 10,      // sec

	  // Messaging server/client constants
	  LONG_POLLING_TIMEOUT = 30,        // sec
	  OFFLINE_DETECT_INTERVAL = 10,     // sec

	  ADMIN_ALL_USERS = 0xFFFF,
	  ALL_ACCESSPOINTS = 0xFF,

	  // Web API constants
	  MAX_RES_TO_PROCESS = 1000,

	  // VOIP auto half duplex constants
	  DEF_HDUPLEX_TIMER_INTERVAL = 50,
	  DEF_HDUPLEX_DETECT_THRESHOLD = 30,
	  DEF_HDUPLEX_UNMUTE_DELAY = 750,

	  // Timer interval which is used to determine if it is time to auto backup
	  MAX_BACKUP_CHECK_TIMER_INTERVAL = 30 * 60 * 1000,
	  MAX_AUTOBACKUP_RETRY = 3,

	  // PanelStatusManager constants
	  MIN_PROCESS_POLLING_INTERVAL = 1500,  // ms
	  MAX_PROCESS_POLLING_INTERVAL = 3000,  // ms
	  MIN_PANEL_POLLING_INTERVAL = 1000,    // ms
	  MAX_PANEL_POLLING_INTERVAL = 3000,    // ms
	  CLOCK_SYNC_TOLORANCE = 5,             // sec
	  CLOCK_SYNC_INTERVAL = 3600,           // sec

	  // Chunk size for backing up eventlogs tables
	  MAX_LINE_IN_EVENTLOG_CHUNKS = 20000,

	  // Bacnet constants
	  MAX_BKN_DEVICE_NAME = 21,
	  MAX_BKN_VENDOR_NAME = 26,
	  MAX_BKN_MODEL_NAME = 16,
	  MAX_BKN_APP_SOFTWARE_VER = 16,
	  MAX_BKN_LOCATION = 26,
	  MAX_BKN_DEVICE_DESCRIPTION = 26,

	  MAX_BKN_CPU = 20,

	  MAX_BKN_ACCESS_POINTS = 16 * 20,  // MAX_ACCESS_POINTS * BKN_CPU_MAX

	  MAX_BKN_IPT_CKTS = 20 * 8, // BKN_CPU_MAX * MAX_INPUT_TYPES
	  MAX_BKN_OPT_CKTS = 20 * 8,          // BKN_CPU_MAX * MAX_OUTPUT_TYPES

	  MAX_BKN_BASE_INSTANCE_IDENTIFIER = 4194302,
	  MAX_BKN_DEVICE_INSTANCE_IDENTIFIER = 4194303,

	  MAX_CAS_OBJECT_COUNT = 27,
	  MAX_TAU_OBJECT_COUNT = 27,
	  MAX_ASSA_OBJECT_COUNT = 208,  //Estimate the number of binary input objects on an AssaAbloy access node

	  // Elevators constants
	  MAX_ELEVATOR_GROUPS = 128,
	  MAX_ELEVATOR_GROUP_NAME = 21,
	  MAX_RELAY_LABEL = 21,
	  MAX_ERU = 6,

	  // Encrypted Correlation & Elevator Control Message grace time
	  MAX_UDP_ENCRYPTION_GRACE_TIME = 60,

	  MAX_DEBUGWIN_LINES = 1000,

	  // Card format constants
	  MAX_SELECTED_CARD_FORMAT = 15,     // Maximum Select Card Formats
	  MAX_CUSTOM_CARD_FORMAT = 14,       // Maximum Custom Card Formats
	  MAX_CARD_FORMAT_LABEL_LEN = 26,    // Max length of card format labels
	  CUSTOM_CARD_FORMAT_START_BIT = 50, // Custom Card Format Start Bit  0-49 predefined, 50-63 custom
	  SPY_MODE_BIT_NUMBER = 12,

	  //Video 
	  MAX_VIDEO_SERVER_NUM = 100,   //allowed video server number
	  MAX_ASSOCIATION_NUM = 20,    //allowed video association item
	  MAX_CAMERA_NUM = 100,        //allowed camera number
	}


	//#define  CFGID_CFU_PASSCODE          1
	//#define  CFGID_TMU_SCHEDULE          2
	//#define  CFGID_TMU_HOLIDAY           3
	//#define  CFGID_CFU_CFG_GEN_INFO      4
	//#define  CFGID_TMU_TIMER_INFO        5
	//#define  CFGID_TAU_OPTIONS           6
	//#define  CFGID_TAU_LCD_MSG           7
	//#define  CFGID_TAU_CORRELATION       8
	//#define  CFGID_CAU_ACCESS_LEVEL      9
	//#define  CFGID_CAU_ACCESS_POINTS     10
	//#define  CFGID_CAU_ACCESS_CONT       11
	//#define  CFGID_CFU_INPUT_TYPES       12
	//#define  CFGID_CFU_OUTPUT_TYPES      13
	//#define  CFGID_CAU_CORRELATION       14
	//#define  CFGID_TMU_DST               15
	//#define  CFGID_SVU_FLASH_CHKSUM      16
	//#define  CFGID_MAX                   CFGID_SVU_FLASH_CHKSUM


	public enum ConfigIDType
	{
	  INVALID = -1,
	  CFU_PASSCODE = 1,
	  TMU_SCHEDULE = 2,
	  TMU_HOLIDAY = 3,
	  CFU_CFG_GEN_INFO = 4,
	  TMU_TIMER_INFO = 5,
	  TAU_OPTIONS = 6,
	  TAU_LCD_MSG = 7,
	  TAU_CORRELATION = 8,
	  CAU_ACCESS_LEVEL = 9,
	  CAU_ACCESS_POINTS = 10,
	  CAU_ACCESS_CONT = 11,
	  CAU_INPUT_TYPES = 12,
	  CAU_OUTPUT_TYPES = 13,
	  CAU_CORRELATION = 14,
	  TMU_DST = 15,
	  SVU_FLASH_CHKSUM = 16,
	  TAU_REG_CS6422 = 17,
	  CFU_IP_CFG = 18,

	  // BACnet
	  BKN_CPU_Info = 19,
	  BKN_DEVICE_INFO = 20,
	  BKN_ACCESSPOINTS_TYPES = 21,
	  BKN_ACCESSPOINTS_No = 22,
	  BKN_INPUT_TYPES = 23,
	  BKN_INPUT_NO = 24,
	  BKN_OUTPUT_TYPES = 25,
	  BKN_OUTPUT_NO = 26,

	  ERU_ACCESS_FLOORS = 27,
	  ERU_FLOORS_INFO = 28,
	  ERU_IP_ADDRESS = 29,

	  CAU_CARDFORMAT = 31,

	  // Configurator defined only 
	  SEND_SIGNITURE = 0,
	  CAU_ACCESS_CARDS = 128,
	  TAU_RESIDENTS = 129,
	  CFU_LOGS = 202,
	  CFU_LOG_INFO = 203,
	  CFU_STRUCT_INFO = 204,
	  CFU_RECORD_INFO = 205,
	  CFU_TIMEDATE_INFO = 206,
	  CFU_STATUS_INFO = 207,
	  TMU_RES_GROUPS = 208,
	  TMU_ADV_GROUPS = 209,
	  CFU_HUB_REV = 210,
	}

	[Flags]
	public enum CardFormat : uint
	{
	  Wiegand26Bit = 0x00000001,
	  Mircom37Bit = 0x00000002,
	  Indala35Bit = 0x00000004,
	  RBH50Bit = 0x00000008,
	  CSN32Bit = 0x00000010,
	  HID37Bit = 0x00000020,
	  HID35Bit = 0x00000040,
	  HID36Bit = 0x00000080,
	  Keyscan36Bit = 0x00000100,
	  Cansec37Bit = 0x00000200,
	  Kantech39Bit = 0x00000400,
	  Awid34bit = 0x00000800,
	}



	class Constants
	{
	  public static readonly Version MIN_512K_FW_VERSION = new Version(3, 0);
	  public const int CMDID_READDATA = 0x01;
	  public const int CMDID_WRITEDATA = 0x02;
	  public const int CMDID_READLOG = 0x03;
	  public const int CMDID_COMMAND = 0x04;
	  public const int CMDID_ENTER_CFG_MODE = 0x05;
	  public const int CMDID_EXIT_CFG_MODE = 0x06;
	  public const int CMDID_SEND_FIRMWARE = 0x07;
	  public const int CMDID_CONNECT_PORT = 0x20;

	  public static int GetConst(Const constant, PanelInfo panelInfo)
	  {
		return GetConst(constant);
	  }

	  public static int GetConst(Const constant)
	  {
		int val;

		switch (constant)
		{
		  default:
			val = (int)constant;
			break;
		}
		return val;
	  }

	  public static bool IsPanelType(TreeNodeType nodeType)
	  {
		return nodeType > TreeNodeType.PANEL_GENERIC && nodeType < TreeNodeType.PANEL_END;
	  }
	}




	[StructLayout(LayoutKind.Sequential, Pack = 1, CharSet = CharSet.Ansi)]
	public struct MsgRaw
	{
	  [MarshalAs(UnmanagedType.ByValArray, SizeConst = 10)]
	  public byte[] Header;

	  public CommMsgType MsgType;

	  [MarshalAs(UnmanagedType.ByValArray, SizeConst = 19)]
	  public byte[] Data;
	}



	[Flags]
	public enum ControlFlags : ushort
	{
	  RetryCount = 0x000F,    // Bit 0-3  Retry count 
	  RetryNoResponse = 0x0020,    // Bit 6
	  RetryCollision = 0x0040,    // Bit 7
	  ErrorCode = 0x1F00,    // Bit 8-11 Error code
	  NACK = 0x2000,    // Bit 13
	  ACK = 0x4000,    // Bit 14 
	  ACKRequired = 0x8000,    // Bit 15
	}

	public enum ControlErrorCode
	{
	  NoError = 0x0000,
	  DataCorrupted = 0x0100,
	  InvalidCfgID = 0x0200,
	  InvalidCheckSum = 0x0300,
	  InvalidRecord = 0x0400,
	  InvalidPasscode = 0x0500,
	  Reserved = 0x0600,
	  NotInConfigMode = 0x0700,
	  Collision = 0x0800,
	  DatabaseFull = 0x0900,
	  InvalidFrame = 0x0A00,
	  PCNotConnected = 0x0B00,
	  PCNotLoggedIn = 0x0C00,
	  WrongSrcID = 0x0D00,
	  WrongFWVer = 0x0E00,
	  FWChksumErr = 0x0F00,
	  NotInFWMode = 0x1000,
	  WrongPanelID = 0x1100,
	}




	[StructLayout(LayoutKind.Sequential, Pack = 1, CharSet = CharSet.Ansi)]
	public struct FrameHeader
	{
	  public byte Preamble;
	  public byte DestDeviceID;
	  public byte SrcDeviceID;
	  public ControlFlags Control;
	  public byte FrameSeqID;
	  public ushort PayloadLen;

	}

	public enum FrameByteIndex
	{
	  Premble = 0,
	  DestDeviceID = 1,
	  SrcDeviceID = 2,
	  Control = 3,
	  FrameSeqID = 5,
	  PayLoadLen = 6,
	  MsgHeader = 8,
	  MsgType = 17,
	}



	public enum ConfigModeReq : byte
	{
	  AbortAndExit = 1,
	  CommitAndExit = 2,
	  EnterConfigMode = 3,
	}

	[Flags]
	public enum DayOfWeekHol : byte
	{
	  Sun = 0x01,
	  Mon = 0x02,
	  Tue = 0x04,
	  Wed = 0x08,
	  Thur = 0x10,
	  Fri = 0x20,
	  Sat = 0x40,
	  Hol = 0x80,
	}

	[Flags]
	public enum CASPanelOptions : uint
	{
	  Networked = 0x01,
	  SendRealTimeLog = 0x02,
	  Interlock = 0x04,
	  InOutReaderMode = 0x08,
	}


	[Flags]
	public enum APOptions : uint
	{
	  BypReader = 0x00000001, // Bit 0
	  AutoRelock = 0x00000002, // Bit 1
	  Handicap = 0x00000004, // Bit 2
	  TempCard = 0x00000008, // Bit 3
	  DisForcEnty = 0x00000010, // Bit 4
	  PCDecision = 0x00000020, // Bit 5
	  FirstPerson = 0x00000040, // Bit 6
	  RTEBypassDC = 0x00000080, // Bit 7
	  HighSecu = 0x00000100, // Bit 8
	  RepRTE = 0x00000200, // Bit 9
	  RepNotOpen = 0x00000400, // Bit 10
	  RepUnFormat = 0x00000800, // Bit 11
	  FacilMode = 0x00001000, // Bit 12
	  InhibitID = 0x00002000, // Bit 13
	  AntiPassBk = 0x00004000, // Bit 14
	  IgnoreFacil = 0x00008000, // Bit 15
	  ReportNotInit = 0x00010000, // Bit 16 (Actually the 17th bit)
	  DisElevAcc = 0x00020000, // Bit 17 
	}


	[Flags]
	public enum CardOptions : ushort
	{
	  HighSecurity = 0x0001,
	  ExtendedLockTime = 0x0002,
	  HandicapAccess = 0x0004,
	  LockUnlock = 0x0008,
	  IgnoreAntiPB = 0x0010,
	  FirstPersonIn = 0x0020
	}


	public enum LogType
	{
	  PC = 0,
	  System = 1,
	  User = 2,
	  All = 4,
	}

	public enum Troubles
	{
	  Restored = 0x00,
	  OpenCircuit = 0x10,
	  ShortCircuit = 0x20,
	  ACFail = 0x30,
	  BatteryFault = 0x40
	}

	public enum CircuitTypes
	{
	  ReaderA_DC = 0,
	  ReaderB_DC = 1,
	  ReaderA_RTE = 2,
	  ReaderB_RTE = 3,
	  GeneralInput = 4,
	  AccessPoint = 10,
	  AC_Power = 14,
	  Battery = 15,
	}

	public enum AccessPointCmd
	{
	  NoCommand = 0,
	  LockDoor = 1,
	  LockMode = 2,
	  HighSecMode = 3,
	  ClearForcedEntry = 4,
	}

	public enum ConnectState
	{
	  Disconnected = 0,
	  Connecting = 1,
	  Connected = 2,
	  Disconnecting = 3,
	}

	public enum ModifiedState : ushort
	{
	  Unmodified = 0,
	  Added = 1,
	  Modified = 2,
	  Removed = 3,
	}

	[Flags]
	public enum UserRights : ulong
	{
	  Tree_Job = 0x0000000000000001,
	  Tree_Network = 0x0000000000000002,
	  Tree_Panels = 0x0000000000000004,
	  Tree_Cards = 0x0000000000000008,
	  Tree_Residents = 0x0000000000000010,
	  Tree_AccLevels = 0x0000000000000020,
	  Tree_Schedules = 0x0000000000000040,
	  Tree_Holidays = 0x0000000000000080,
	  Tree_NetStatus = 0x0000000000000100,
	  Tree_ElevGroups = 0x0000000000000120,
	  Tree_Cameras = 0x0000000000000140,

	  Menu_Job = 0x0000000001000000,
	  Menu_Backup = 0x0000000002000000,
	  Menu_Print = 0x0000000004000000,
	  Menu_Exit = 0x0000000008000000,
	  Menu_JobMenus = 0x000000000F000000,

	  Menu_EditPanel = 0x0000001000000000,
	  Menu_EditCard = 0x0000002000000000,
	  Menu_EditRes = 0x0000004000000000,

	  Menu_Connect = 0x0000010000000000,
	  Menu_SendJob = 0x0000020000000000,
	  Menu_GetJob = 0x0000040000000000,
	  Menu_Detect = 0x0000080000000000,
	  Menu_Firmware = 0x0000100000000000,

	  Menu_SysCmd = 0x0001000000000000,
	  Menu_DoorCmd = 0x0002000000000000,

	  Menu_EvtReport = 0x0010000000000000,
	  Menu_CfgReport = 0x0020000000000000,
	  Menu_AdmReport = 0x0040000000000000,
	  Menu_AllReport = 0x0FF0000000000000,

	  Menu_UserMngnt = 0x1000000000000000,
	  Menu_IPChange = 0x2000000000000000,
	  Menu_AlertSetup = 0x3000000000000000,

	  Role_BasicCard = Tree_Cards | Menu_Print | Menu_Backup | Menu_Exit | Menu_EditCard | Menu_Connect | Menu_SendJob | Menu_AdmReport,
	  Role_AdvCard = Role_BasicCard | Tree_AccLevels | Tree_Schedules | Tree_Holidays | Menu_JobMenus | Tree_ElevGroups,
	  Role_BasicRes = Tree_Residents | Menu_Print | Menu_Backup | Menu_Exit | Menu_EditRes | Menu_Connect | Menu_SendJob | Menu_AdmReport,
	  Role_AdvRes = Role_BasicRes | Menu_JobMenus,
	  Role_Admin = 0xFFFFFFFFFFFFFFFF,

	  Role_Operator = Tree_NetStatus | Menu_Connect | Menu_Exit,
	  Role_User = Role_Operator | Role_BasicCard | Role_BasicRes,
	  Role_AdvUser = Role_User | Role_AdvCard | Role_AdvRes | Menu_AllReport | Tree_Job | Tree_Network | Tree_Cameras,
	  Role_Manager = Role_AdvUser | Menu_UserMngnt | Menu_AlertSetup,
	  Role_Full = Role_Admin,
	}

	public enum UserRole
	{
	  Operator = 0,
	  User = 1,
	  AdvUser = 2,
	  Manager = 3,
	  Full = 4,
	}

	/// <summary>
	/// Language for application
	/// </summary>
	public enum Language
	{
	  English = 0,
	  French = 1,
	  Spanish = 2,
	}

	public enum PhoneLineType
	{
	  NotConfigured = 0,
	  ADC = 1,
	  NSL = 2,
	}

	[Flags]
	public enum KeylessEntryCorr : byte
	{
	  MainDoor = 0x01,
	  AuxDoor = 0x02,
	}


	[Flags]
	public enum ModifiedFlag : ushort
	{
	  None = 0x0000,
	  Modified = 0x0001,    // Record was sent to panel and is now modified by users
	  Added = 0x0002,    // Record was added to database but never send to panel
	  Removed = 0x0004,    // Record was modified by users and is now deleted
	}


	[Flags]
	public enum TraceOption : byte
	{
	  None = 0x00,
	  Exception = 0x01,
	  MinorException = 0x02,
	  MajorStatus = 0x04,
	  Status = 0x08,
	  Default = TraceOption.Status,

	  Level1 = TraceOption.Exception | TraceOption.MajorStatus,
	  Level2 = TraceOption.Exception | TraceOption.MinorException | TraceOption.MajorStatus,
	  Level3 = TraceOption.Exception | TraceOption.MinorException | TraceOption.MajorStatus | TraceOption.Status,
	}

	public enum NewJobOption
	{
	  Normal,
	  CopyCurrentOnly,
	  FromPanelsOnly
	}

	public enum WaitFormOption
	{
	  None,
	  WaitJobLoaderComplete,
	  WaitEventLoggerComplete,
	  Timer,
	  WaitRestoreBackupComplete,
	}

	public enum FontSelection
	{
	  Terminal = 0,
	  WesternEng = 1,
	  Batang = 2,
	}

	public enum VGridSearchOption
	{
	  ContainWord,        // Match if contain criteria 
	  StartWord,          // Match if starts with criteria
	  ExactMatch,         // Match if all characters match
	}

	public enum TouchThemeItem
	{
	  Version = 0,

	  // Residents
	  ResFont = 1,
	  ResBackColor = 2,
	  ResFontColor = 3,
	  ResHighlightColor = 4,
	  ResHighlightFontColor = 5,
	  ResAltFontColor = 6,
	  ResAltHighlightColor = 7,
	  ResAltBackgroundColor = 8,
	  ResGridColor = 9,
	  ResTextAlign = 10,
	  ResColumnTitleFont = 11,
	  ResColumnTitleFontColor = 12,
	  ResColumnTitleBackColor = 13,
	  ResColumnTitleTextAlign = 14,
	  ResRowSize = 15,
	  ResDialCodeColSize = 16,

	  // Scroll Up and Down Buttons
	  ScrollButtColor = 17,
	  ScrollButtBorderColor = 18,
	  ScrollButtShade = 19,

	  // Call Button 
	  CallButtFont = 20,
	  CallButtFontColor = 21,
	  CallButtColor = 22,
	  CallButtBorderColor = 23,
	  CallButtShade = 24,

	  // Leave Message Button
	  LeaveMsgButtFont = 25,
	  LeaveMsgButtFontColor = 26,
	  LeaveMsgButtColor = 27,
	  LeaveMsgButtBorderColor = 28,
	  LeaveMsgButtShade = 29,

	  //Help / Info Button
	  HelpButtFont = 30,
	  HelpButtFontColor = 31,
	  HelpButtColor = 32,
	  HelpButtBorderColor = 33,
	  HelpButtShade = 34,

	  //Call Reception Button
	  CallRecepButtFont = 35,
	  CallRecepButtFontColor = 36,
	  CallRecepButtColor = 37,
	  CallRecepButtBorderColor = 38,
	  CallRecepButtShade = 39,

	  // Show Flash Banner Button
	  ShowFlashButtFont = 40,
	  ShowFlashButtFontColor = 41,
	  ShowFlashButtColor = 42,
	  ShowFlashButtBorderColor = 43,
	  ShowFlashButtShade = 44,

	  //Keyboard Buttons       
	  KeyboardNumbersButtFont = 45,
	  KeyboardNumbersButtFontColor = 46,
	  KeyboardNumbersButtColor = 47,
	  KeyboardNumbersButtBorderColor = 48,
	  KeyboardNumbersButtShade = 49,

	  KeyboardAlphabetsButtFont = 50,
	  KeyboardAlphabetsButtFontColor = 51,
	  KeyboardAlphabetsButtColor = 52,
	  KeyboardAlphabetsButtBorderColor = 53,
	  KeyboardAlphabetsButtShade = 54,

	  //Miscellaneous
	  SearchBoxColor = 55,
	  SearchBoxFont = 56,
	  SearchBoxFontColor = 57,

	  DialCodeFont = 58,
	  DialCodeFontColor = 59,

	  ClockMinuteHandColor = 60,
	  ClockSecondHandColor = 61,
	  ClockHourHandColor = 62,
	  ClockTicksColor = 63,

	  DateFont = 64,
	  DateFontColor = 65,

	  InfoBoxFont = 66,
	  InfoBoxFontColor = 67,
	  InfoBoxBorderColor = 68,

	  ResBoxFont = 69,
	  ResBoxFontColor = 70,
	  ResBoxBorderColor = 71,

	  ResDetailBoxFont = 72,
	  ResDetailBoxColor = 73,
	  ResDetailBoxBorderColor = 74,

	  //General
	  EventFormBackColor = 75,
	  EventFormButtColor = 76,
	  EventFormFont = 77,
	  EventFormFontColor = 78,

	  InvalidEntryBackColor = 79,
	  InvalidEntryFont = 80,
	  InvalidEntryFontColor = 81,

	  MainScreenBackColor = 82,
	  KeyboardBackColor = 83,

	  // Resident group buttons
	  GroupButtFont = 84,
	  GroupButtFontColor = 85,
	  GroupButtColor = 86,
	  GroupButtBorderColor = 87,
	  GroupButtSelectColor = 88,

	  EventFormPushToTalkButtColor = 89,
	}


	public enum TouchThemeDataType
	{
	  Number = 0,
	  Enum = 1,
	  String = 2,
	  Font = 3,
	  Color = 4,
	}


	public enum TouchThemeCategory
	{
	  Residents = 0,
	  ScrollUpDownButtons = 1,
	  CallButton = 2,
	  LeaveMsgButton = 3,
	  HelpButton = 4,
	  CallRecepButton = 5,
	  ShowFlashButton = 6,
	  KeyboardButtons = 7,
	  Misc = 8,
	  General = 9,
	  ResidentGroupButtons = 10,
	}

	public enum TouchThemeTextAlign
	{
	  Left = 0,
	  Middle = 1,
	  Right = 2,
	}

	public enum TouchThemeShade
	{
	  Light = 0,
	  Dark = 1,
	}

	//Used by TouchScreenCtrl.cs
	public enum TouchMediaFormType
	{
	  MainVideo = 0,
	  HelpVideo = 3,
	  TopBanner = 4,
	  BottomBanner = 1,
	  Screensaver = 2,
	}

	/// <summary>
	/// Enumeration. 0 - single video, 1 - advertising playlist, 2 - disable video 
	/// </summary>
	public enum TouchMediaSelFormType
	{
	  SingleVideo,
	  AdvertisingPlaylist,
	  DisableVideo,
	}

	// Used by DResidents.cs
	public enum ResidentExistResult
	{
	  DoesNotExist,
	  NameExist,
	  DialCodeExist,
	  KeylessCodeExist,
	  RelayCodeExist
	}

	/// <summary>
	/// Button Mode for TouchResidentGroups
	/// </summary>
	public enum ButtonMode
	{
	  PicText = 2,
	  Pic = 1,
	  Text = 0,
	}

	/// <summary>
	/// WindowID for TouchAdvertising
	/// </summary>
	public enum WindowID
	{
	  mainVideo = 0,
	  bottomBanner = 1,
	  screenSaver = 2,
	};

	/// <summary>
	/// Column index for resident import excel tool
	/// </summary>
	public enum ResExcelImportCol
	{
	  nameCol = 0,
	  dialCodeCol = 1,
	  phoneCol = 2,
	  aptCol = 3,
	  keylessCol = 4,
	  relayCol = 5,
	  sipName,
	  cardNum,
	  facilityCode,
	  accessLevel,
	  address,
	  email,
	}

	public enum CardExcelImportCol
	{
	  cardNameCol = 0,
	  cardNumberCol = 1,
	  cardFacilityCol = 2,
	  cardAptCol = 3,
	  cardAddressCol = 4,
	}

	public enum FWUpgradeErrorType
	{
	  FileReadErr,
	  USBErr,
	  PanelErr,
	  UserCancel,
	  General,
	}

	public enum FWWorkerState
	{
	  SelectNextModel,
	  MsgFWUpdate,
	  DataBroadcast,
	  MsgFWCommit,
	  Reset,
	  Stop,
	}

	public enum FWUpdateCmdMode : byte
	{
	  Update = 1,
	  Abort = 2,
	  Commit = 3
	}

	public enum ProcessState
	{
	  Shutdown = 0,
	  StartingUp = 1,
	  Idle = 2,
	  Busy = 3,
	  ConfigMode = 4,
	}

	public enum ProcessHealthStatus
	{
	  Normal,
	  Warning,
	  VerySick
	}

	public enum EchoReductionType
	{
	  DoNotSend = 0,
	  Profile1 = 1,
	  Profile2 = 2,
	  Profile3 = 3,
	  Profile4 = 4,
	}

	/// <summary>
	/// Operating system identifier
	/// </summary>
	public enum OSFamily
	{
	  WinXP = 0,
	  Win7 = 1,
	}


	[Flags]
	public enum ApplicationFeatures : ulong
	{
	  AcceptWSClientConnect = 0x0000000000000001,  // Accept web service connections from clients (pull data from clients)
	  AcceptWSServerConnect = 0x0000000000000002,  // Accept web service connections from server (push data from server)
	  ConnectCloudServer = 0x0000000000000004,  // Initiate connections to cloud server
	  ConnectUSBClients = 0x0000000000000008,  // Initiate connections to clients using USB
	  ConnectIPClients = 0x0000000000000010,  // Initiate connections to clients using IP
	  ConnectModemClients = 0x0000000000000020,  // Initiate connections to clients using modem

	  WebApplication = 0x0000000000000100,  // Support web browser application
	  DataSyncWSAPI = 0x0000000000000200,  // Support data sync web service API

	  PollingPanels = 0x0000000000001000,  // Actively polling connected panel statuses and send event messages
	  AutoConnect = 0x0000000000002000,  // Automatically connect to panels when the application starts
	  AutoAddPanel = 0x0000000000004000,  // Add panels to job tree automatically when new panels are connected
	  PanelDiscovery = 0x0000000000008000,  // Has panel descovery feature
	  AutoSyncDatabase = 0x0000000000010000,  // Support configuration data sync (with clients or server)
	  AutoSyncEvents = 0x0000000000020000,  // Support event sync (with clients or server)
	  AutoCloudBackup = 0x0000000000040000,  // Support auto job backups (with clients or server)
	  CloudDiagnostics = 0x0000000000080000,  // Support system diagnostics (with clients or server)
	  MultiUserJobs = 0x0000000000100000,  // Support multiple user jobs
	  EmailAlerts = 0x0000000000200000,  // Send email alerts 
	  AutoLocalBackup = 0x0000000000400000,  // Automatically backup jobs to local disk
	  NVR_LiveStreaming = 0x0000000001000000,  // Support NVR live streaming
	  NVR_ViewRecording = 0x0000000002000000,  // Support viewing NVR recordings
	  NVR_Config = 0x0000000004000000,  // Support configuring NVR settings
	  NVR_Commands = 0x0000000008000000,  // Support sending commands to NVR server

	  GatewayBACNet = 0x0000010000000000,  // Support BACNet as a gateway

	  // Acting as a server running in the cloud VM
	  CloudServerMode = AcceptWSClientConnect | WebApplication | DataSyncWSAPI | AutoConnect | AutoAddPanel | PanelDiscovery |
						 AutoSyncDatabase | AutoSyncEvents | AutoCloudBackup | CloudDiagnostics | MultiUserJobs | EmailAlerts,
	  // Acting as a local server running on site, more like a gateway
	  LocalServerMode = AcceptWSServerConnect | ConnectCloudServer | ConnectUSBClients | ConnectIPClients | ConnectModemClients |
						 WebApplication | DataSyncWSAPI | PollingPanels | AutoConnect | PanelDiscovery | AutoSyncDatabase |
						 AutoSyncEvents | AutoCloudBackup | CloudDiagnostics,
	  // Acting as a configurator running on a PC or laptop
	  ConfiguratorMode = AcceptWSServerConnect | ConnectUSBClients | ConnectIPClients | ConnectModemClients | PollingPanels |
						  PanelDiscovery | EmailAlerts | AutoLocalBackup,
	  // Acting as a server app running inside a touch screen unit
	  TouchScreenMode = AcceptWSClientConnect | AcceptWSServerConnect | ConnectCloudServer | ConnectUSBClients | DataSyncWSAPI |
						 /*PollingPanels | */ AutoConnect | PanelDiscovery |  /*AutoSyncDatabase |*/  /*AutoSyncEvents | */ AutoCloudBackup |
						 CloudDiagnostics,
	  // Acting as a gateway/bridge to connect local devices to the cloud server 
	  GatewayMode = AcceptWSServerConnect | ConnectCloudServer | ConnectUSBClients | ConnectIPClients | ConnectModemClients |
						PollingPanels | AutoConnect | AutoSyncDatabase | AutoSyncEvents | AutoCloudBackup | CloudDiagnostics,
	}


	//Enum declarations for strings
	/*****************************************************************************************************************************************/
	public enum LanguageItemID
	{
	  RESIDENT_DIRECTORY = 0,
	  RESIDENT_NOT_FOUND = 1,
	  DIAL_CODE_NA = 2,
	  INFORMATION = 3,
	  RESIDENT_DETAIL = 4,
	  CANCEL_SEARCH_BUTT = 5,
	  CALL_RESIDENT_BUTT = 6,
	  LEAVE_MSG_BUTT = 7,
	  SCROLL_DOWN_BUTT = 8,
	  SCROLL_UP_BUTT = 9,
	  INFO_HELP_BUTT = 10,
	  CALL_RECEPTION_BUTT = 11,
	  OK_BUTT = 12,
	  STOP_HELP_BUTT = 13,
	  DISCONNECT_CALL_BUTT = 14,
	  PLEASE_WAIT = 15,
	  CONNECTING_CALL = 16,
	  CALL_CONNECTED_TO = 17,
	  ACCESS_DENIED = 18,
	  AUX_DOOR_OPEN = 19,
	  CALL_IN_PROGRESS = 20,
	  CALL_NOT_AVAIL = 21,
	  CALLED_PARTY_BUSY = 22,
	  CALLING_RECEPTION = 23,
	  CONFIG_MODE = 24,
	  DATABASE_EMPTY = 25,
	  DIAL_CODE_NOT_FOUND = 26,
	  DISCONNECTING_CALL = 27,
	  GUARD_PH0NE_CALLING = 28,
	  GUARD_PH0NE_CONNECTED = 29,
	  GUARD_PH0NE_NOT_CONNECTED = 30,
	  KEYLESS_CODE_NOT_FOUND = 31,
	  KEYLESS_ENTRY_NA = 32,
	  LINE_IN_USE = 33,
	  LINE_NOT_CONNECTED = 34,
	  MAIN_DOOR_OPEN = 35,
	  MAIN_N_AUX_DOOR_OPEN = 36,
	  NO_DIAL_TONE = 37,
	  POSTAL_USAGE_EXCEEDED = 38,
	  SYSTEM_NORMAL = 39,
	  UNUSED_LINE_SELECTED = 40,
	  SELECT_RESIDENT = 41,
	  RES_NAME = 46,
	  DIAL_CODE = 47,
	  SPACE_BUTT = 48,
	  SHIFT_BUTT = 49,
	  ENTER_BUTT = 50,
	  WELCOME_BANNER = 51,
	  NO_MATCH_DIALCODE = 52,
	  DIALCODE_INVALID_1 = 53,
	  DIALCODE_INVALID_2 = 54,
	  ENTER_KEYLESS_CODE = 55,
	  INVALID_KEYLESS_CODE = 56,
	  CANCEL_BUTT = 57,
	  ENTER_PASSWORD = 58,
	  TOUCH_TO_BEGIN = 59,
	  ANALOG_VOICE_CALL = 60,
	  VOIP_VIDEO_CALL = 61,
	  PUSH_TO_TALK = 62,
	}

	public enum DBChangedCompleteOption
	{
	  ImportFiles,
	  Abort,
	  SendJob,
	}

	public enum ConnectIconState
	{
	  None,
	  Connecting,
	  ConnectedVoice,
	  ConnectedVOIP,
	  Disconnecting,
	}

	public enum LobbyDoor
	{
	  MainDoor = 1,
	  AuxDoor = 2,
	  BothDoors = 3,
	}

	public enum EmailHostType
	{
	  Custom_SMTP,
	  Live,
	  Gmail
	  //Yahoo,
	  //Hotmail,
	  //AOL
	}

	public enum TouchEventType : int
	{
	  Undefined = 0,
	  FlickNorth,
	  FlickSouth,
	  FlickWest,
	  FlickEast,
	  DragNorth,
	  DragSouth,
	  DragWest,
	  DragEast,
	  TouchDown = 9,
	  LiftOff,
	  Drag,
	  Hold = 12,
	}


	public enum DefaultRowHeight
	{
	  HeaderRowHeight = 45,
	  RowHeight = 60
	}

	public enum ApplicationRunningMode
	{
	  CloudServerMode,
	  LocalServerMode,
	  ConfiguratorMode,
	  TouchScreenMode,
	  GatewayMode
	}

	// Keyboard types
	public enum KBType : byte
	{
	  Full = 0, // full keyboard
	  PlusNumPad = 1, // keyboard + numpad
	  Simple = 2, // Simple Keyboard
	  Config = 3, // Configuration Keyboard
	  Accessible = 4, // Accessible keyboard (ADA compliant)
	}

	public enum BackupRestoreMode
	{
	  BackupJob = 1,
	  RestoreJob = 2,
	}

	public enum CallEndReasonCodes
	{
	  EndedByLocalUser,            /// 0  Local endpoint application cleared call
	  EndedByNoAccept,             /// 1  Local endpoint did not accept call OnIncomingCall()=false
	  EndedByAnswerDenied,         /// 2  Local endpoint declined to answer call
	  EndedByRemoteUser,           /// 3  Remote endpoint application cleared call
	  EndedByRefusal,              /// 4  Remote endpoint refused call
	  EndedByNoAnswer,             /// 5  Remote endpoint did not answer in required time
	  EndedByCallerAbort,          /// 6  Remote endpoint stopped calling
	  EndedByTransportFail,        /// 7  Transport error cleared call
	  EndedByConnectFail,          /// 8  Transport connection failed to establish call
	  EndedByGatekeeper,           /// 9  Gatekeeper has cleared call
	  EndedByNoUser,               /// 10 Call failed as could not find user (in GK)
	  EndedByNoBandwidth,          /// 11 Call failed as could not get enough bandwidth
	  EndedByCapabilityExchange,   /// 12 Could not find common capabilities
	  EndedByCallForwarded,        /// 13 Call was forwarded using FACILITY message
	  EndedBySecurityDenial,       /// 14 Call failed a security check and was ended
	  EndedByLocalBusy,            /// 15 Local endpoint busy
	  EndedByLocalCongestion,      /// 16 Local endpoint congested
	  EndedByRemoteBusy,           /// 17 Remote endpoint busy
	  EndedByRemoteCongestion,     /// 18 Remote endpoint congested
	  EndedByUnreachable,          /// 19 Could not reach the remote party
	  EndedByNoEndPoint,           /// 20 The remote party is not running an endpoint
	  EndedByHostOffline,          /// 21 The remote party host off line
	  EndedByTemporaryFailure,     /// 22 The remote failed temporarily app may retry
	  EndedByQ931Cause,            /// 23 The remote ended the call with unmapped Q.931 cause code
	  EndedByDurationLimit,        /// 24 Call cleared due to an enforced duration limit
	  EndedByInvalidConferenceID,  /// 25 Call cleared due to invalid conference ID
	  EndedByNoDialTone,           /// 26 Call cleared due to missing dial tone
	  EndedByNoRingBackTone,       /// 27 Call cleared due to missing ringback tone
	  EndedByOutOfService,         /// 28 Call cleared because the line is out of service, 
	  EndedByAcceptingCallWaiting, /// 29 Call cleared because another call is answered
	  EndedByGkAdmissionFailed,    /// 30 Call cleared because gatekeeper admission request failed.
	};

	public enum SyncClockMode
	{
	  Disable = 0,
	  ToPC = 1,
	  ToTimeServer = 2
	}

	public enum TouchGUIObject
	{
	  CallReceptionButton = 0,
	  LeaveMsgButton = 1,
	  CallButton = 2,
	  HelpButton = 3
	}

	public enum TouchGUIObjectOption
	{
	  Default = 0,
	  Hide = 1,
	  Customize = 2
	}

	public enum VideoServerType
	{
	  MarchNetworksRecorder = 0,
	  MarchNetworksCES = 1,
	  ExecQ = 2,
	}

	public enum CameraChannelType
	{
	  Audio,
	  Video,
	  Text
	}
	 /// <summary>
	 /// It describes the items type.
	 /// </summary>
	public enum PanelItemType
	{
	  AccessPoint,
	  Input,
	  Output,
	}

	/// <summary>
	/// It is use identify type of items used on floor map.
	/// </summary>
	public enum MapItemType
	{
	  AccessPoint,
	  Input,
	  Output,
	  Camera,
	  Building,
	  Map
	}

	public enum CameraLayoutID
	{
	  Cam1,
	  Cam4,
	  Cam5,
	  Cam6,
	  Cam8,
	  Cam9,
	  Cam12,
	  Cam15,
	  Cam16,
	}

	/// <summary>
	/// It is use to identify the type of widget.
	/// </summary>
	public enum WidgetType
	{
	  AccessPoint,
	  Camera,
	  Chart,
	  Map,
	  System
	}


	public enum ReportType
	{
	  LiveChart,
	  Chart,
	  EventLog,
	  People,
	  Credentials,
	  Residents,
	  Saved
	}

	/// <summary>
	/// It is use to identify the type of chart.
	/// </summary>
	public enum ChartType
	{
	  Line,
	  Pie,
	  Area,
	  Table
	}
	 /// <summary>
	 /// Use to get type of monitoring objects.
	 /// </summary>
	public enum MonitoringObjectType
	{
	  AccessPoint = 0, 
	  Map = 1,
	  MapItem = 2,
	  Panel = 3,
	  Building = 4,  // Internal use only, not for ObjectStatus table
	  SiteMap = 5,  // Internal use only, not for ObjectStatus table
	}

	/// <summary>
	/// Describe the current object status. 
	/// </summary>
	public enum MonitoringObjectStatus
	{
	  Offline = 0, // it describes that object is offline state.
	  Normal = 1,  // it describes that object is Nomal state.
	  Trouble = 2, // it describes that object is Trouble state.
	  Alarm = 3,   // it describes that object is Alarm state.
	  Unknown = 4, // it describes that object is Unknown state.
	}

	public enum EventSeverity
	{
	  Normal,  // Nothing to worry about such as grant access and restore events
	  Warning, // Something to pay attention to
	  Alarm    // Should attend to ASAP such as Alarms and Troubles
	}

	/// <summary>
	/// Map Types enum
	/// </summary>
	public enum MapTypes
	{
	  SiteMap, //use to identify the site/job.
	  Building //use to identify building.
	}
  }
}

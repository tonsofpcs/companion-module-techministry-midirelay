// techministry-midirelay

const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const io = require('socket.io-client');

class midirelayInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
		})

		this.STATUS = {
			information: '',
			version: '',
			controlStatus: false
		};

		this.MIDI_outputs = [];
		this.MIDI_outputs_list = [
			{id: '0', label: '(Select a MIDI Port)'}
		];

		this.MIDI_notes = [
			{id: 0, label: '0 - unassigned'},
			{id: 1, label: '1 - unassigned'},
			{id: 2, label: '2 - unassigned'},
			{id: 3, label: '3 - unassigned'},
			{id: 4, label: '4 - unassigned'},
			{id: 5, label: '5 - unassigned'},
			{id: 6, label: '6 - unassigned'},
			{id: 7, label: '7 - unassigned'},
			{id: 8, label: '8 - unassigned'},
			{id: 9, label: '9 - unassigned'},
			{id: 10, label: '10 - unassigned'},
			{id: 11, label: '11 - unassigned'},
			{id: 12, label: '12 - unassigned'},
			{id: 13, label: '13 - unassigned'},
			{id: 14, label: '14 - unassigned'},
			{id: 15, label: '15 - unassigned'},
			{id: 16, label: '16 - unassigned'},
			{id: 17, label: '17 - unassigned'},
			{id: 18, label: '18 - unassigned'},
			{id: 19, label: '19 - unassigned'},
			{id: 20, label: '20 - unassigned'},
			{id: 21, label: '21 - A0'},
			{id: 22, label: '22 - A#0'},
			{id: 23, label: '23 - B0'},
			{id: 24, label: '24 - C1'},
			{id: 25, label: '25 - C#1'},
			{id: 26, label: '26 - D1'},
			{id: 27, label: '27 - D#1'},
			{id: 28, label: '28 - E1'},
			{id: 29, label: '29 - F1'},
			{id: 30, label: '30 - F#1'},
			{id: 31, label: '31 - G1'},
			{id: 32, label: '32 - G#1'},
			{id: 33, label: '33 - A1'},
			{id: 34, label: '34 - A#1'},
			{id: 35, label: '35 - B1'},
			{id: 36, label: '36 - C2'},
			{id: 37, label: '37 - C#2'},
			{id: 38, label: '38 - D2'},
			{id: 39, label: '39 - D#2'},
			{id: 40, label: '40 - E2'},
			{id: 41, label: '41 - F2'},
			{id: 42, label: '42 - F#2'},
			{id: 43, label: '43 - G2'},
			{id: 44, label: '44 - G#2'},
			{id: 45, label: '45 - A2'},
			{id: 46, label: '46 - A#2'},
			{id: 47, label: '47 - B2'},
			{id: 48, label: '48 - C3'},
			{id: 49, label: '49 - C#3'},
			{id: 50, label: '50 - D3'},
			{id: 51, label: '51 - D#3'},
			{id: 52, label: '52 - E3'},
			{id: 53, label: '53 - F3'},
			{id: 54, label: '54 - F#3'},
			{id: 55, label: '55 - G3'},
			{id: 56, label: '56 - G#3'},
			{id: 57, label: '57 - A3'},
			{id: 58, label: '58 - A#3'},
			{id: 59, label: '59 - B3'},
			{id: 60, label: '60 - C4'},
			{id: 61, label: '61 - C#4'},
			{id: 62, label: '62 - D4'},
			{id: 63, label: '63 - D#4'},
			{id: 64, label: '64 - E4'},
			{id: 65, label: '65 - F4'},
			{id: 66, label: '66 - F#4'},
			{id: 67, label: '67 - G4'},
			{id: 68, label: '68 - G#4'},
			{id: 69, label: '69 - A4'},
			{id: 70, label: '70 - A#4'},
			{id: 71, label: '71 - B4'},
			{id: 72, label: '72 - C5'},
			{id: 73, label: '73 - C#5'},
			{id: 74, label: '74 - D5'},
			{id: 75, label: '75 - D#5'},
			{id: 76, label: '76 - E5'},
			{id: 77, label: '77 - F5'},
			{id: 78, label: '78 - F#5'},
			{id: 79, label: '79 - G5'},
			{id: 80, label: '80 - G#5'},
			{id: 81, label: '81 - A5'},
			{id: 82, label: '82 - A#5'},
			{id: 83, label: '83 - B5'},
			{id: 84, label: '84 - C6'},
			{id: 85, label: '85 - C#6'},
			{id: 86, label: '86 - D6'},
			{id: 87, label: '87 - D#6'},
			{id: 88, label: '88 - E6'},
			{id: 89, label: '89 - F6'},
			{id: 90, label: '90 - F#6'},
			{id: 91, label: '91 - G6'},
			{id: 92, label: '92 - G#6'},
			{id: 93, label: '93 - A6'},
			{id: 94, label: '94 - A#6'},
			{id: 95, label: '95 - B6'},
			{id: 96, label: '96 - C7'},
			{id: 97, label: '97 - C#7'},
			{id: 98, label: '98 - D7'},
			{id: 99, label: '99 - D#7'},
			{id: 100, label: '100 - E7'},
			{id: 101, label: '101 - F7'},
			{id: 102, label: '102 - F#7'},
			{id: 103, label: '103 - G7'},
			{id: 104, label: '104 - G#7'},
			{id: 105, label: '105 - A7'},
			{id: 106, label: '106 - A#7'},
			{id: 107, label: '107 - B7'},
			{id: 108, label: '108 - C8'},
			{id: 109, label: '109 - C#8'},
			{id: 110, label: '110 - D8'},
			{id: 111, label: '111 - D#8'},
			{id: 112, label: '112 - E8'},
			{id: 113, label: '113 - F8'},
			{id: 114, label: '114 - F#8'},
			{id: 115, label: '115 - G8'},
			{id: 116, label: '116 - G#8'},
			{id: 117, label: '117 - A8'},
			{id: 118, label: '118 - A#8'},
			{id: 119, label: '119 - B8'},
			{id: 120, label: '120 - C9'},
			{id: 121, label: '121 - C#9'},
			{id: 122, label: '122 - D9'},
			{id: 123, label: '123 - D#9'},
			{id: 124, label: '124 - E9'},
			{id: 125, label: '125 - F9'},
			{id: 126, label: '126 - F#9'},
			{id: 127, label: '127 - G9'}
		];

		this.MIDI_controllers = [
			{id: 0, label: '0 - Bank Select (MSB)'},
			{id: 1, label: '1 - Modulation Wheel (MSB)'},
			{id: 2, label: '2 - Breath Controler (MSB)'},
			{id: 3, label: '3 - Undefined (MSB)'},
			{id: 4, label: '4 - Foot Pedal (MSB)'},
			{id: 5, label: '5 - Portamento Time (MSB)'},
			{id: 6, label: '6 - Data Entry (MSB)'},
			{id: 7, label: '7 - Volume (MSB)'},
			{id: 8, label: '8 - Balance (MSB)'},
			{id: 9, label: '9 - Undefined (MSB)'},
			{id: 10, label: '10 - Pan (MSB)'},
			{id: 11, label: '11 - Expression (MSB)'},
			{id: 12, label: '12 - Effect Controller 1 (MSB)'},
			{id: 13, label: '13 - Effect Controller 2 (MSB)'},
			{id: 14, label: '14 - Undefined (MSB)'},
			{id: 15, label: '15 - Undefined (MSB)'},
			{id: 16, label: '16 - General Purpose (MSB)'},
			{id: 17, label: '17 - General Purpose (MSB)'},
			{id: 18, label: '18 - General Purpose (MSB)'},
			{id: 19, label: '19 - General Purpose (MSB)'},
			{id: 20, label: '20 - Undefined (MSB)'},
			{id: 21, label: '21 - Undefined (MSB)'},
			{id: 22, label: '22 - Undefined (MSB)'},
			{id: 23, label: '23 - Undefined (MSB)'},
			{id: 24, label: '24 - Undefined (MSB)'},
			{id: 25, label: '25 - Undefined (MSB)'},
			{id: 26, label: '26 - Undefined (MSB)'},
			{id: 27, label: '27 - Undefined (MSB)'},
			{id: 28, label: '28 - Undefined (MSB)'},
			{id: 29, label: '29 - Undefined (MSB)'},
			{id: 30, label: '30 - Undefined (MSB)'},
			{id: 31, label: '31 - Undefined (MSB)'},
			{id: 32, label: '32 - Bank Select (LSB)'},
			{id: 33, label: '33 - Modulation Wheel (LSB)'},
			{id: 34, label: '34 - Breath Controler (LSB)'},
			{id: 35, label: '35 - Undefined (LSB)'},
			{id: 36, label: '36 - Foot Pedal (LSB)'},
			{id: 37, label: '37 - Portamento Time (LSB)'},
			{id: 38, label: '38 - Data Entry (LSB)'},
			{id: 39, label: '39 - Volume (LSB)'},
			{id: 40, label: '40 - Balance (LSB)'},
			{id: 41, label: '41 - Undefined (LSB)'},
			{id: 42, label: '42 - Pan (LSB)'},
			{id: 43, label: '43 - Expression (LSB)'},
			{id: 44, label: '44 - Effect Controller 1 (LSB)'},
			{id: 45, label: '45 - Effect Controller 2 (LSB)'},
			{id: 46, label: '46 - Undefined (LSB)'},
			{id: 47, label: '47 - Undefined (LSB)'},
			{id: 48, label: '48 - General Purpose (LSB)'},
			{id: 49, label: '49 - General Purpose (LSB)'},
			{id: 50, label: '50 - General Purpose (LSB)'},
			{id: 51, label: '51 - General Purpose (LSB)'},
			{id: 52, label: '52 - Undefined (LSB)'},
			{id: 53, label: '53 - Undefined (LSB)'},
			{id: 54, label: '54 - Undefined (LSB)'},
			{id: 55, label: '55 - Undefined (LSB)'},
			{id: 56, label: '56 - Undefined (LSB)'},
			{id: 57, label: '57 - Undefined (LSB)'},
			{id: 58, label: '58 - Undefined (LSB)'},
			{id: 59, label: '59 - Undefined (LSB)'},
			{id: 60, label: '60 - Undefined (LSB)'},
			{id: 61, label: '61 - Undefined (LSB)'},
			{id: 62, label: '62 - Undefined (LSB)'},
			{id: 63, label: '63 - Undefined (LSB)'},
			{id: 64, label: '64 - Damper Pedal on/off'},
			{id: 65, label: '65 - Portamento on/off'},
			{id: 66, label: '66 - Sostenuto Pedal on/off'},
			{id: 67, label: '67 - Soft Pedal on/off'},
			{id: 68, label: '68 - Legato Pedal on/off'},
			{id: 69, label: '69 - Hold Pedal 2 on/off'},
			{id: 70, label: '70 - Sound Variation'},
			{id: 71, label: '71 - Sound Timbre'},
			{id: 72, label: '72 - Sound Release Time'},
			{id: 73, label: '73 - Sound Attack Time'},
			{id: 74, label: '74 - Sound Brightness'},
			{id: 75, label: '75 - Sound Control 6'},
			{id: 76, label: '76 - Sound Control 7'},
			{id: 77, label: '77 - Sound Control 8'},
			{id: 78, label: '78 - Sound Control 9'},
			{id: 79, label: '79 - Sound Control 10'},
			{id: 80, label: '80 - General Purpose Button'},
			{id: 81, label: '81 - General Purpose Button'},
			{id: 82, label: '82 - General Purpose Button'},
			{id: 83, label: '83 - General Purpose Button'},
			{id: 84, label: '84 - Undefined on/off'},
			{id: 85, label: '85 - Undefined on/off'},
			{id: 86, label: '86 - ndefined on/off'},
			{id: 87, label: '87 - Undefined on/off'},
			{id: 88, label: '88 - Undefined on/off'},
			{id: 89, label: '89 - Undefined on/off'},
			{id: 90, label: '90 - Undefined on/off'},
			{id: 91, label: '91 - Effects/Reverb Level'},
			{id: 92, label: '92 - Tremulo Level'},
			{id: 93, label: '93 - Chorus Level'},
			{id: 94, label: '94 - Celeste (Detune) Level'},
			{id: 95, label: '95 - Phaser Level'},
			{id: 96, label: '96 - Data Entry +1'},
			{id: 97, label: '97 - Data Entry -1'},
			{id: 98, label: '98 - NRPN (MSB)'},
			{id: 99, label: '99 - NRPN (LSB)'},
			{id: 100, label: '100 - RPN (MSB)'},
			{id: 101, label: '101 - RPN (LSB)'},
			{id: 102, label: '102 - Undefined'},
			{id: 103, label: '103 - Undefined'},
			{id: 104, label: '104 - Undefined'},
			{id: 105, label: '105 - Undefined'},
			{id: 106, label: '106 - Undefined'},
			{id: 107, label: '107 - Undefined'},
			{id: 108, label: '108 - Undefined'},
			{id: 109, label: '109 - Undefined'},
			{id: 110, label: '110 - Undefined'},
			{id: 111, label: '111 - Undefined'},
			{id: 112, label: '112 - Undefined'},
			{id: 113, label: '113 - Undefined'},
			{id: 114, label: '114 - Undefined'},
			{id: 115, label: '115 - Undefined'},
			{id: 116, label: '116 - Undefined'},
			{id: 117, label: '117 - Undefined'},
			{id: 118, label: '118 - Undefined'},
			{id: 119, label: '119 - Undefined'},
			{id: 120, label: '120 - All Sound Off'},
			{id: 121, label: '121 - Reset All Controllers'},
			{id: 122, label: '122 - Local Switch on/off'},
			{id: 123, label: '123 - All Notes Off'},
			{id: 124, label: '124 - Omni Mode Off'},
			{id: 125, label: '125 - Omni Mode On'},
			{id: 126, label: '126 - Monophonic Mode On'},
			{id: 127, label: '127 - Polyphonic Mode On'}
		];

		this.MSC_deviceid = [];

		this.MSC_commandformat = [
			{id: 'lighting.general', label: 'Lighting - General'},
			{id: 'sound.general', label: 'Sound - General'},
			{id: 'machinery.general', label: 'Machinery - General'},
			{id: 'video.general', label: 'Video - General'},
			{id: 'projection.general', label: 'Projection - General'},
			{id: 'processcontrol.general', label: 'Process Control - General'},
			{id: 'pyro.general', label: 'Pyro - General'},
			{id: 'all', label: 'All'}
		];

		this.MSC_command = [
			{id: 'go', label: 'Go'},
			{id: 'stop', label: 'Stop'},
			{id: 'gojam', label: 'Go Jam'},
			{id: 'resume', label: 'Resume'},
			{id: 'timedgo', label: 'Timed Go'},
			{id: 'load', label: 'Load'},
			{id: 'set', label: 'Set'},
			{id: 'fire', label: 'Fire'},
			{id: 'alloff', label: 'All Off'},
			{id: 'restore', label: 'Restore'},
			{id: 'reset', label: 'Reset'},
			{id: 'gooff', label: 'Go Off'},
			{id: 'opencuelist', label: 'Open Cue List'},
			{id: 'closecuelist', label: 'Close Cue List'},
			{id: 'startclock', label: 'Start Clock'},
			{id: 'stopclock', label: 'Stop Clock'}
		];
	}

	async destroy() {
		if (this.socket !== undefined) {
			this.socket.disconnect();
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
		}

		let listObj = {};
		//build MIDI Show Control Device ID list
		for (let i = 0; i < 112; i++) {
			listObj = {};
			listObj.id = i;
			listObj.label = i + '';
			this.MSC_deviceid.push(listObj);
		}
		for (let i = 1; i < 16; i++) {
			listObj = {};
			listObj.id = 'g' + i;
			listObj.label = 'Group ' + i;
			this.MSC_deviceid.push(listObj);
		}
		listObj = {};
		listObj.id = 'all';
		listObj.label = 'All Devices';
		this.MSC_deviceid.push(listObj);
	
		this.updateStatus(InstanceStatus.Connecting)
	
		this.initConnection();
	
		this.initActions();
		this.initFeedbacks();
		this.initVariables();
		this.initPresets();
	
		this.checkFeedbacks();
		this.checkVariables();
	}

	initConnection() {
		let self = this;

		if (this.config.host) {
			this.log('info', `Opening connection to midi-relay: ${this.config.host}:${this.config.port}`);
	
			this.socket = io.connect('http://' + this.config.host + ':' + this.config.port, {reconnection: true});
			this.log('info', 'Connecting to midi-relay...');
			this.STATUS.information = 'Connecting to midi-relay';
			this.checkVariables();
	
			// Add listeners
			this.socket.on('connect', function() { 
				self.log('info', 'Connected to midi-relay. Retrieving data.');
				self.updateStatus(InstanceStatus.Ok);
				self.STATUS.information = 'Connected';
				self.sendCommand('version', null, null);
				self.sendCommand('midi_outputs', null, null);
				self.checkVariables();
				self.getState();
			});
	
			this.socket.on('disconnect', function() { 
				self.updateStatus(InstanceStatus.ConnectionFailure);
				self.log('error', 'Disconnected from midi-relay.');
				self.STATUS.information = 'Disconnected';
				self.checkVariables();
			});
	
			this.socket.on('version', function(version) {
				self.STATUS.version = version;
				self.checkVariables();
			});

			this.socket.on('midi_outputs', function(midi_outputs) {
				let outputsList = []
				for (let i = 0; i < midi_outputs.length; i++) {
					outputsList.push({ id: midi_outputs[i].name, label: `${midi_outputs[i].name}` });
				}
				self.MIDI_outputs = midi_outputs;
				self.MIDI_outputs_list = outputsList;
				self.initActions();
				self.checkVariables();
			});
	
			this.socket.on('control_status', function(status) {
				self.STATUS.controlStatus = status;
				if (status == false) {
					self.updateStatus(InstanceStatus.UnknownWarning);
					self.STATUS.information = 'Control has been disabled via midi-relay.';
					self.log('warning', 'Control has been disabled via midi-relay.');
				}
				else {
					self.updateStatus(InstanceStatus.Ok);
					self.STATUS.information = 'Control has been enabled via midi-relay.';
					self.log('info', 'Control has been enabled via midi-relay.');
				}
				self.checkVariables();
				self.checkFeedbacks();
			});
	
			this.socket.on('error', function(error) {
				self.updateStatus(InstanceStatus.ConnectionFailure);
				self.log('error', 'Error from midi-relay: ' + error);
			});
		}
	}
	
	getState() { //gets the most recent list of midi output ports from midi-relay
		this.sendCommand('midi_outputs');
	}

	sendCommand(cmd, arg1 = null, arg2 = null) {	
		if (this.socket !== undefined) {
			if (this.config.verbose) {
				this.log('info', 'Sending: ' + cmd);
			}
	
			if (arg1 !== null) {
				if (arg2 !== null) {
					this.socket.emit(cmd, arg1, arg2);
				}
				else {
					this.socket.emit(cmd, arg1);
				}
			}
			else {
				this.socket.emit(cmd);
			}
		}
		else {
			debug('Unable to send: Not connected to midi-relay.');
	
			if (this.config.verbose) {
				this.log('warn', 'Unable to send: Not connected to midi-relay.');
			}
		}
	};
}

runEntrypoint(midirelayInstance, UpgradeScripts)
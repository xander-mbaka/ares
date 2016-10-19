/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50527
Source Host           : 127.0.0.1:3306
Source Database       : ares

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2016-10-19 11:05:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for appointments
-- ----------------------------
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visitor_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `office` varchar(255) DEFAULT NULL,
  `scheduled_stamp` bigint(25) DEFAULT NULL,
  `arrival_stamp` bigint(25) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of appointments
-- ----------------------------

-- ----------------------------
-- Table structure for complex_types
-- ----------------------------
DROP TABLE IF EXISTS `complex_types`;
CREATE TABLE `complex_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `locations` varchar(255) DEFAULT NULL,
  `event_types` varchar(255) DEFAULT NULL,
  `window` int(11) DEFAULT NULL,
  `counter_measures` varchar(255) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of complex_types
-- ----------------------------
INSERT INTO `complex_types` VALUES ('1', 'Attack at gate a', '1', '1,2,3', '60', null, '1');

-- ----------------------------
-- Table structure for counter_measures
-- ----------------------------
DROP TABLE IF EXISTS `counter_measures`;
CREATE TABLE `counter_measures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of counter_measures
-- ----------------------------

-- ----------------------------
-- Table structure for counter_measure_types
-- ----------------------------
DROP TABLE IF EXISTS `counter_measure_types`;
CREATE TABLE `counter_measure_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of counter_measure_types
-- ----------------------------
INSERT INTO `counter_measure_types` VALUES ('1', 'Security Guard', 'Human-Computer_Agent', 'Defense,Offense', null, null);
INSERT INTO `counter_measure_types` VALUES ('2', 'UAV - Attack Drone', 'Electro-Mechanical Actuator', 'Defense,Offense', null, null);
INSERT INTO `counter_measure_types` VALUES ('3', 'Sound Alarm', 'Electro-Mechanical Actuator', 'Defense', null, null);
INSERT INTO `counter_measure_types` VALUES ('4', 'Road Bollard', 'Electro-Mechanical Actuator', 'Defense', null, null);
INSERT INTO `counter_measure_types` VALUES ('5', 'Lock', 'Electro-Mechanical Actuator', 'Defense', null, null);
INSERT INTO `counter_measure_types` VALUES ('6', 'Attack Dog', 'Trained-Animal', 'Defense,Offense', null, null);
INSERT INTO `counter_measure_types` VALUES ('7', 'UAV - Advance Surveilance', 'Electro-Mechanical Actuator', 'Information', null, null);

-- ----------------------------
-- Table structure for event_types
-- ----------------------------
DROP TABLE IF EXISTS `event_types`;
CREATE TABLE `event_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `sensor_type_id` int(11) DEFAULT NULL,
  `lower` int(11) DEFAULT NULL,
  `upper` int(11) DEFAULT NULL,
  `weight` tinyint(2) DEFAULT NULL,
  `assumption` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of event_types
-- ----------------------------
INSERT INTO `event_types` VALUES ('1', 'Object very close', '1', '3', '0', '50', '3', 'Close by');
INSERT INTO `event_types` VALUES ('2', 'Object arriving too fast', '1', '11', '30', '100', '9', 'Brace for impact');
INSERT INTO `event_types` VALUES ('3', 'Red alert', '1', '7', '7', '10', '8', 'Send for backup');

-- ----------------------------
-- Table structure for locations
-- ----------------------------
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  `multiplier` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of locations
-- ----------------------------
INSERT INTO `locations` VALUES ('1', 'Gate A', null, null, null, null, null);
INSERT INTO `locations` VALUES ('2', 'Gate B', null, null, null, null, null);
INSERT INTO `locations` VALUES ('3', 'Gate C', null, null, null, null, null);
INSERT INTO `locations` VALUES ('4', 'JKAC', null, null, null, null, null);
INSERT INTO `locations` VALUES ('5', 'Hall 6 - Upper Floors', null, null, null, null, null);
INSERT INTO `locations` VALUES ('6', 'Hall 6 - Lower Floors', null, null, null, null, null);
INSERT INTO `locations` VALUES ('7', 'Computer LAB A', null, null, null, null, null);
INSERT INTO `locations` VALUES ('8', 'Engineering LABs', null, null, null, null, null);
INSERT INTO `locations` VALUES ('9', 'Telecomms LAB', null, null, null, null, null);
INSERT INTO `locations` VALUES ('10', 'Department Office', null, null, null, null, null);
INSERT INTO `locations` VALUES ('11', 'Academic Registry', null, null, null, null, null);
INSERT INTO `locations` VALUES ('12', 'Mess Hall', null, null, null, null, null);
INSERT INTO `locations` VALUES ('13', 'Library', null, null, null, null, null);
INSERT INTO `locations` VALUES ('14', 'East Fence', null, null, null, null, null);

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` int(11) DEFAULT NULL,
  `to` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text,
  `sent_stamp` bigint(25) DEFAULT NULL,
  `viewed_stamp` bigint(25) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for modules
-- ----------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `view_ids` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of modules
-- ----------------------------
INSERT INTO `modules` VALUES ('1', 'Command Dashboard', 'fa-home', '1', '1', null);
INSERT INTO `modules` VALUES ('2', 'Locations', 'fa-comments', '2', '1', null);
INSERT INTO `modules` VALUES ('3', 'Sensors', 'fa-pied-piper-alt', '3', '1', null);
INSERT INTO `modules` VALUES ('4', 'Security Manager', 'fa-money', '4', '1', null);
INSERT INTO `modules` VALUES ('5', 'Counter Measures', 'fa-shopping-cart', '5', '1', null);
INSERT INTO `modules` VALUES ('6', 'People', 'fa-users', '6', '1', null);
INSERT INTO `modules` VALUES ('7', 'Reports', 'fa-file-text-o', '7', '1', null);
INSERT INTO `modules` VALUES ('8', 'Tools', 'fa-gears', '8', '1', null);

-- ----------------------------
-- Table structure for parties
-- ----------------------------
DROP TABLE IF EXISTS `parties`;
CREATE TABLE `parties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `secondary_contact` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of parties
-- ----------------------------

-- ----------------------------
-- Table structure for party_logs
-- ----------------------------
DROP TABLE IF EXISTS `party_logs`;
CREATE TABLE `party_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `party_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `notes` text,
  `timestamp` bigint(25) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of party_logs
-- ----------------------------

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `views` varchar(255) DEFAULT NULL,
  `operations` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', 'System Architect', '1,2,6,3,4,5,10,11,12,7,8,9,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33', null);
INSERT INTO `roles` VALUES ('2', 'Manager', '1,2', null);
INSERT INTO `roles` VALUES ('4', 'Secretary', '1,2,3,4,5,42', null);
INSERT INTO `roles` VALUES ('5', 'HR Manager', '27,28,29,32,33,38,42', null);

-- ----------------------------
-- Table structure for security_event_log
-- ----------------------------
DROP TABLE IF EXISTS `security_event_log`;
CREATE TABLE `security_event_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `threat_level` tinyint(2) DEFAULT NULL,
  `start_stamp` bigint(25) DEFAULT NULL,
  `end_stamp` bigint(25) DEFAULT NULL,
  `log_ids` varchar(255) DEFAULT NULL,
  `media` varchar(255) DEFAULT NULL,
  `notes` text,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of security_event_log
-- ----------------------------

-- ----------------------------
-- Table structure for sensors
-- ----------------------------
DROP TABLE IF EXISTS `sensors`;
CREATE TABLE `sensors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `serial` varchar(255) DEFAULT NULL,
  `pin_id` varchar(5) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sensors
-- ----------------------------
INSERT INTO `sensors` VALUES ('1', 'Room X Microphone', 'wdwqd', 'A0', '1', '8', '1');
INSERT INTO `sensors` VALUES ('2', 'Gate A Proximity Sensor', 'drr43t45', '6', '3', '1', '1');
INSERT INTO `sensors` VALUES ('3', 'Gate A Velocity Sensor', 'drr43t45', '6', '11', '1', '1');
INSERT INTO `sensors` VALUES ('4', 'Gate A Duty Sentry', null, '', '7', '1', '1');
INSERT INTO `sensors` VALUES ('5', 'Gate A Seismic Sensor', '4234r34r', 'A1', '2', '1', '1');
INSERT INTO `sensors` VALUES ('6', 'Gate A Weighing Bridge', '678678', 'A4', '6', '1', '1');

-- ----------------------------
-- Table structure for sensor_types
-- ----------------------------
DROP TABLE IF EXISTS `sensor_types`;
CREATE TABLE `sensor_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `space` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `multiplier` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sensor_types
-- ----------------------------
INSERT INTO `sensor_types` VALUES ('1', 'Audio Sensor', 'Microphone', null, 'Variable', 'Loudness', null);
INSERT INTO `sensor_types` VALUES ('2', 'Vibration Sensor', null, null, 'Binary', 'Disturbance', null);
INSERT INTO `sensor_types` VALUES ('3', 'Object Proximity Sensor', 'Ultrasonic range sensor - determines threat level by incorporating object approach speed', null, 'Variable', 'Distance', null);
INSERT INTO `sensor_types` VALUES ('4', 'RFID Sensor', null, null, 'Binary', 'Arrival', null);
INSERT INTO `sensor_types` VALUES ('5', 'Motion Sensor', null, null, 'Binary', 'Movement', null);
INSERT INTO `sensor_types` VALUES ('6', 'Weight Sensor', null, null, 'Variable', 'Heaviness', null);
INSERT INTO `sensor_types` VALUES ('7', 'Situation Assesment', 'Mobile App or Physical Switch', null, 'Variable', 'Vulnerability', null);
INSERT INTO `sensor_types` VALUES ('8', 'Scout Drone', 'UAV', null, 'Variable', 'FramesPerSecond', null);
INSERT INTO `sensor_types` VALUES ('10', 'Location Sensor', 'GPS', null, 'Variable', 'GeographicCoordinates', null);
INSERT INTO `sensor_types` VALUES ('11', 'Object Velocity Sensor', 'Based on proximity sensor data', null, 'Variable', 'ApproachSpeed', null);

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('9YDd56oUO3r9Nl8gUVNPCLiiDpvjJRde', '1476925537', 0x7B22636F6F6B6965223A7B226F726967696E616C4D6178416765223A6E756C6C2C2265787069726573223A6E756C6C2C22687474704F6E6C79223A747275652C2270617468223A222F227D2C2275736572223A7B226964223A312C22757365726E616D65223A2261646D696E222C2270617274794964223A312C22726F6C654964223A312C2263617465676F7279223A2256656E646F72222C2270617373776F7264223A2266383635623533363233623132316664333465653534323663373932653563333361663863323237222C22726F6C65223A7B226964223A312C226E616D65223A2253797374656D20417263686974656374222C227669657773223A22312C322C362C332C342C352C31302C31312C31322C372C382C392C31332C31342C31352C31362C31372C31382C31392C32302C32312C32322C32332C32342C32352C32362C32372C32382C32392C33302C33312C33322C3333222C226F7065726174696F6E73223A6E756C6C2C2270726573656E746174696F6E223A7B2231223A7B227669657773223A225B7B5C2269645C223A312C5C226D6F64756C6549645C223A312C5C226E616D655C223A5C2244617368626F6172645C222C5C226C6F676F5C223A5C2266612D686F6D655C222C5C226C696E6B5C223A5C2273686F77446173685C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A322C5C226D6F64756C6549645C223A312C5C226E616D655C223A5C22506F7374204D656D6F5C222C5C226C6F676F5C223A5C2266612D7477697463685C222C5C226C696E6B5C223A5C22706F73744D656D6F5C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A332C5C226D6F64756C6549645C223A312C5C226E616D655C223A5C224E6F7469636520426F6172645C222C5C226C6F676F5C223A5C2266612D6C616E67756167655C222C5C226C696E6B5C223A5C22766965774D656D6F735C222C5C22706F736974696F6E5C223A337D2C7B5C2269645C223A342C5C226D6F64756C6549645C223A312C5C226E616D655C223A5C224576656E7420416E616C797369735C222C5C226C6F676F5C223A5C2266612D757365725C222C5C226C696E6B5C223A5C226576656E74416E616C797369735C222C5C22706F736974696F6E5C223A347D2C7B5C2269645C223A352C5C226D6F64756C6549645C223A312C5C226E616D655C223A5C224576656E74204C6F675C222C5C226C6F676F5C223A5C2266612D75736572735C222C5C226C696E6B5C223A5C226576656E744C6F675C222C5C22706F736974696F6E5C223A357D5D222C226E616D65223A22436F6D6D616E642044617368626F617264222C226C6F676F223A2266612D686F6D65227D2C2232223A7B227669657773223A225B7B5C2269645C223A362C5C226D6F64756C6549645C223A322C5C226E616D655C223A5C224C6F636174696F6E204F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D63616C63756C61746F725C222C5C226C696E6B5C223A5C226164644C6F636174696F6E5C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A372C5C226D6F64756C6549645C223A322C5C226E616D655C223A5C224C6F636174696F6E732052656769737472795C222C5C226C6F676F5C223A5C2266612D666F6C6465725C222C5C226C696E6B5C223A5C226C6F636174696F6E735C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A382C5C226D6F64756C6549645C223A322C5C226E616D655C223A5C224D61705C222C5C226C6F676F5C223A5C2266612D666F6C6465722D6F70656E5C222C5C226C696E6B5C223A5C226C6F636174696F6E734D61705C222C5C22706F736974696F6E5C223A337D5D222C226E616D65223A224C6F636174696F6E73222C226C6F676F223A2266612D636F6D6D656E7473227D2C2233223A7B227669657773223A225B7B5C2269645C223A392C5C226D6F64756C6549645C223A332C5C226E616D655C223A5C2254797065735C222C5C226C6F676F5C223A5C2266612D66696C652D6F5C222C5C226C696E6B5C223A5C2273656E736F72547970655C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A31312C5C226D6F64756C6549645C223A332C5C226E616D655C223A5C224F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D6D6F6E65795C222C5C226C696E6B5C223A5C2261646453656E736F725C222C5C22706F736974696F6E5C223A337D2C7B5C2269645C223A31322C5C226D6F64756C6549645C223A332C5C226E616D655C223A5C2252656769737472795C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C2273656E736F72735C222C5C22706F736974696F6E5C223A347D2C7B5C2269645C223A31332C5C226D6F64756C6549645C223A332C5C226E616D655C223A5C2244657669636520486973746F72795C222C5C226C6F676F5C223A5C2266612D736C69646572735C222C5C226C696E6B5C223A5C2273656E736F72446174615C222C5C22706F736974696F6E5C223A357D5D222C226E616D65223A2253656E736F7273222C226C6F676F223A2266612D706965642D70697065722D616C74227D2C2234223A7B227669657773223A225B7B5C2269645C223A31302C5C226D6F64756C6549645C223A342C5C226E616D655C223A5C224576656E742053656D616E746963735C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C226576656E7454797065735C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A31342C5C226D6F64756C6549645C223A342C5C226E616D655C223A5C224F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D7069652D63686172745C222C5C226C696E6B5C223A5C22636F6D706C65784576656E745C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A31352C5C226D6F64756C6549645C223A342C5C226E616D655C223A5C2252656769737472795C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C22636F6D706C65784576656E74735C222C5C22706F736974696F6E5C223A337D5D222C226E616D65223A225365637572697479204D616E61676572222C226C6F676F223A2266612D6D6F6E6579227D2C2235223A7B227669657773223A225B7B5C2269645C223A31362C5C226D6F64756C6549645C223A352C5C226E616D655C223A5C2254797065735C222C5C226C6F676F5C223A5C2266612D6372656469742D636172645C222C5C226C696E6B5C223A5C22636F756E74657254797065735C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A31372C5C226D6F64756C6549645C223A352C5C226E616D655C223A5C224F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C22616464436F756E7465725C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A31382C5C226D6F64756C6549645C223A352C5C226E616D655C223A5C2252656769737472795C222C5C226C6F676F5C223A5C2266612D6D6F6E65795C222C5C226C696E6B5C223A5C22636F756E7465724D656173757265735C222C5C22706F736974696F6E5C223A337D2C7B5C2269645C223A31392C5C226D6F64756C6549645C223A352C5C226E616D655C223A5C2244657669636520486973746F72795C222C5C226C6F676F5C223A5C2266612D6D6F6E65795C222C5C226C696E6B5C223A5C22636F756E746572486973746F72795C222C5C22706F736974696F6E5C223A347D5D222C226E616D65223A22436F756E746572204D65617375726573222C226C6F676F223A2266612D73686F7070696E672D63617274227D2C2236223A7B227669657773223A225B7B5C2269645C223A32302C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C22436C69656E74204F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D6D6F6E65795C222C5C226C696E6B5C223A5C2261646456697369746F725C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A32312C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C225374616666204F726967696E6174696F6E5C222C5C226C6F676F5C223A5C2266612D62616E6B5C222C5C226C696E6B5C223A5C2261646453746166665C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A32322C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C225265676973747279206F6620506572736F6E735C222C5C226C6F676F5C223A5C2266612D757365725C222C5C226C696E6B5C223A5C22706572736F6E52656769737472795C222C5C22706F736974696F6E5C223A337D2C7B5C2269645C223A32332C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C2253637265656E696E67204C6973745C222C5C226C6F676F5C223A5C2266612D75736572735C222C5C226C696E6B5C223A5C2273637265656E4C6973745C222C5C22706F736974696F6E5C223A347D2C7B5C2269645C223A32342C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C225363686564756C65204170706F696E746D656E745C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C226170706F696E746D656E74735C222C5C22706F736974696F6E5C223A357D2C7B5C2269645C223A32352C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C22436865636B20496E5C222C5C226C6F676F5C223A5C2266612D6D6F6E65795C222C5C226C696E6B5C223A5C22636865636B496E5C222C5C22706F736974696F6E5C223A367D2C7B5C2269645C223A32362C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C22436865636B204F75745C222C5C226C6F676F5C223A5C2266612D636C6970626F6172645C222C5C226C696E6B5C223A5C22636865636B4F75745C222C5C22706F736974696F6E5C223A377D2C7B5C2269645C223A32372C5C226D6F64756C6549645C223A362C5C226E616D655C223A5C225665726966792043726564656E7469616C735C222C5C226C6F676F5C223A5C2266612D757365725C222C5C226C696E6B5C223A5C2276657269667943726564656E7469616C735C222C5C22706F736974696F6E5C223A387D5D222C226E616D65223A2250656F706C65222C226C6F676F223A2266612D7573657273227D2C2237223A7B227669657773223A225B7B5C2269645C223A33302C5C226D6F64756C6549645C223A372C5C226E616D655C223A5C2253797374656D205265706F7274735C222C5C226C6F676F5C223A5C2266612D66696C652D746578742D6F5C222C5C226C696E6B5C223A5C2273797374656D5265706F7274735C222C5C22706F736974696F6E5C223A337D5D222C226E616D65223A225265706F727473222C226C6F676F223A2266612D66696C652D746578742D6F227D2C2238223A7B227669657773223A225B7B5C2269645C223A33312C5C226D6F64756C6549645C223A382C5C226E616D655C223A5C225573657273204D616E616765725C222C5C226C6F676F5C223A5C2266612D75736572735C222C5C226C696E6B5C223A5C2275736572735C222C5C22706F736974696F6E5C223A317D2C7B5C2269645C223A33322C5C226D6F64756C6549645C223A382C5C226E616D655C223A5C2241636365737320526967687473204D616E616765725C222C5C226C6F676F5C223A5C2266612D736C69646572735C222C5C226C696E6B5C223A5C22726F6C65735C222C5C22706F736974696F6E5C223A327D2C7B5C2269645C223A33332C5C226D6F64756C6549645C223A382C5C226E616D655C223A5C224368616E67652050617373776F72645C222C5C226C6F676F5C223A5C2266612D6B65795C222C5C226C696E6B5C223A5C2270617373776F72645C222C5C22706F736974696F6E5C223A337D5D222C226E616D65223A22546F6F6C73222C226C6F676F223A2266612D6765617273227D7D7D7D7D);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `party_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `access` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', 'f865b53623b121fd34ee5426c792e5c33af8c227', 'Vendor', '1', '1', '1');
INSERT INTO `users` VALUES ('4', 'ROBERT', 'cb7aaf3e60e55dcce6976482a5b7c20dab903e88', 'Employee', '27', '5', '1');
INSERT INTO `users` VALUES ('5', 'LINUS', '973ec198393abc18a34cc391609cf75574416d28', 'Employee', '28', '2', '1');
INSERT INTO `users` VALUES ('6', 'MERCY', '3a6cdeea40fee6f76fb03e508f37f73761b542b6', 'Employee', '32', '6', '1');
INSERT INTO `users` VALUES ('7', 'RODA', '1aa8a9a093cd1b8a820fd6e92c62fbc6ef375b62', 'Employee', '30', '9', '1');
INSERT INTO `users` VALUES ('8', 'MUGOI', '1b90bb4607a17de1d7b180fbc7120e6a699e8953', 'Employee', '35', '7', '1');
INSERT INTO `users` VALUES ('9', 'MUGOI', '1b90bb4607a17de1d7b180fbc7120e6a699e8953', 'Employee', '35', '7', '1');
INSERT INTO `users` VALUES ('10', 'MUGOI', '1b90bb4607a17de1d7b180fbc7120e6a699e8953', 'Employee', '35', '7', '1');

-- ----------------------------
-- Table structure for views
-- ----------------------------
DROP TABLE IF EXISTS `views`;
CREATE TABLE `views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `link` varchar(50) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `pos` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of views
-- ----------------------------
INSERT INTO `views` VALUES ('1', '1', 'Dashboard', 'fa-home', 'showDash', '1', '1');
INSERT INTO `views` VALUES ('2', '1', 'Post Memo', 'fa-twitch', 'postMemo', '1', '2');
INSERT INTO `views` VALUES ('3', '1', 'Notice Board', 'fa-language', 'viewMemos', '1', '3');
INSERT INTO `views` VALUES ('4', '1', 'Event Analysis', 'fa-user', 'eventAnalysis', '1', '4');
INSERT INTO `views` VALUES ('5', '1', 'Event Log', 'fa-users', 'eventLog', '1', '5');
INSERT INTO `views` VALUES ('6', '2', 'Location Origination', 'fa-calculator', 'addLocation', '1', '1');
INSERT INTO `views` VALUES ('7', '2', 'Locations Registry', 'fa-folder', 'locations', '1', '2');
INSERT INTO `views` VALUES ('8', '2', 'Map', 'fa-folder-open', 'locationsMap', '1', '3');
INSERT INTO `views` VALUES ('9', '3', 'Types', 'fa-file-o', 'sensorType', '1', '1');
INSERT INTO `views` VALUES ('10', '4', 'Event Types', 'fa-clipboard', 'eventTypes', '1', '1');
INSERT INTO `views` VALUES ('11', '3', 'Origination', 'fa-money', 'addSensor', '1', '3');
INSERT INTO `views` VALUES ('12', '3', 'Registry', 'fa-clipboard', 'sensors', '1', '4');
INSERT INTO `views` VALUES ('13', '3', 'Device History', 'fa-sliders', 'sensorData', '1', '5');
INSERT INTO `views` VALUES ('14', '4', 'Compound Event Definition', 'fa-pie-chart', 'complexEvent', '1', '2');
INSERT INTO `views` VALUES ('15', '4', 'Event Registry', 'fa-clipboard', 'complexEvents', '1', '3');
INSERT INTO `views` VALUES ('16', '5', 'Types', 'fa-credit-card', 'counterTypes', '1', '1');
INSERT INTO `views` VALUES ('17', '5', 'Origination', 'fa-clipboard', 'addCounter', '1', '2');
INSERT INTO `views` VALUES ('18', '5', 'Registry', 'fa-money', 'counterMeasures', '1', '3');
INSERT INTO `views` VALUES ('19', '5', 'Device History', 'fa-money', 'counterHistory', '1', '4');
INSERT INTO `views` VALUES ('20', '6', 'Client Origination', 'fa-money', 'addVisitor', '1', '1');
INSERT INTO `views` VALUES ('21', '6', 'Staff Origination', 'fa-bank', 'addStaff', '1', '2');
INSERT INTO `views` VALUES ('22', '6', 'Registry of Persons', 'fa-user', 'personRegistry', '1', '3');
INSERT INTO `views` VALUES ('23', '6', 'Screening List', 'fa-users', 'screenList', '1', '4');
INSERT INTO `views` VALUES ('24', '6', 'Schedule Appointment', 'fa-clipboard', 'appointments', '1', '5');
INSERT INTO `views` VALUES ('25', '6', 'Check In', 'fa-money', 'checkIn', '1', '6');
INSERT INTO `views` VALUES ('26', '6', 'Check Out', 'fa-clipboard', 'checkOut', '1', '7');
INSERT INTO `views` VALUES ('27', '6', 'Verify Credentials', 'fa-user', 'verifyCredentials', '1', '8');
INSERT INTO `views` VALUES ('28', '7', 'Security Reports', 'fa-file-text-o', 'securityReports', '0', '1');
INSERT INTO `views` VALUES ('29', '7', 'Persons Reports', 'fa-file-text-o', 'personsReports', '0', '2');
INSERT INTO `views` VALUES ('30', '7', 'System Reports', 'fa-file-text-o', 'systemReports', '1', '3');
INSERT INTO `views` VALUES ('31', '8', 'Users Manager', 'fa-users', 'users', '1', '1');
INSERT INTO `views` VALUES ('32', '8', 'Access Rights Manager', 'fa-sliders', 'roles', '1', '2');
INSERT INTO `views` VALUES ('33', '8', 'Change Password', 'fa-key', 'password', '1', '3');

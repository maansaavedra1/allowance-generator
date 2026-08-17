function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    if (action === 'validate_pin') return respond(validatePIN(data.pin, data.tool, data.device_id));
    if (action === 'validate_email') return respond(validateEmail(data.email, data.tool, data.device_id));
    if (action === 'log_tool_access') return respond(logToolAccess(data.email, data.device_id, data.tool));
    if (action === 'log_export') return respond(logExport(data.email, data.device_id, data.tool, data.export_type, data.config_snapshot));
    if (action === 'log_session') return respond(logSession(data.email, data.device_id, data.duration));
    return respond({success: false, message: 'Unknown action'});
  } catch(err) {
    return respond({success: false, message: err.message});
  }
}

function doGet(e) {
  return respond({success: false, message: 'GET not supported'});
}

function validatePIN(pin, tool, deviceId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = ss.getSheetByName('Users');
  var data = users.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var name = String(data[i][0]).trim();
    var email = String(data[i][1]).trim();
    var storedPin = String(data[i][2]).trim();
    var status = String(data[i][3]).trim();
    var access = String(data[i][7] || 'V1,V2').trim(); // col H = Access

    if (storedPin === String(pin).trim()) {
      if (status === 'USED') {
        return {success: false, message: 'PIN already used. Log in with your email.'};
      }
      if (status !== 'UNUSED') {
        return {success: false, message: 'PIN is inactive. Contact your administrator.'};
      }

      var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      users.getRange(i + 1, 4).setValue('USED');
      users.getRange(i + 1, 5).setValue(now);
      users.getRange(i + 1, 6).setValue(tool);
      users.getRange(i + 1, 7).setValue(deviceId || '');

      var log = ss.getSheetByName('Usage Log');
      log.appendRow([now, name, email, pin, 'Hub', '', deviceId || '']);

      return {success: true, message: 'Access granted', name: name, email: email, access: access};
    }
  }
  return {success: false, message: 'Invalid PIN. Please check and try again.'};
}

function validateEmail(email, tool, deviceId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = ss.getSheetByName('Users');
  var data = users.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var name = String(data[i][0]).trim();
    var storedEmail = String(data[i][1]).trim().toLowerCase();
    var status = String(data[i][3]).trim();
    var registeredDevice = String(data[i][6] || '').trim();
    var access = String(data[i][7] || 'V1,V2').trim();

    if (storedEmail === email.trim().toLowerCase() && status === 'USED') {
      if (registeredDevice && deviceId && registeredDevice !== deviceId) {
        return {success: false, message: 'This device is not registered. Ask your admin for a new PIN.'};
      }

      var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      var log = ss.getSheetByName('Usage Log');
      log.appendRow([now, name, email, '', 'Hub', '', deviceId || '']);

      return {success: true, message: 'Welcome back', name: name, email: storedEmail, access: access};
    }
  }

  var emailExists = false;
  for (var j = 1; j < data.length; j++) {
    if (String(data[j][1]).trim().toLowerCase() === email.trim().toLowerCase()) {
      emailExists = true; break;
    }
  }
  if (emailExists) {
    return {success: false, message: 'This device is not registered. Ask your admin for a new PIN.'};
  }
  return {success: false, message: 'Email not found. Please check and try again.'};
}

function logToolAccess(email, deviceId, tool) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName('Usage Log');
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var users = ss.getSheetByName('Users');
  var data = users.getDataRange().getValues();
  var name = email;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toLowerCase() === email.trim().toLowerCase()) {
      name = String(data[i][0]).trim();
      break;
    }
  }
  log.appendRow([now, name, email, '', tool, '', deviceId || '']);
  return {success: true, message: 'Tool access logged'};
}

function logExport(email, deviceId, tool, exportType, configSnapshot) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName('Export Log');
  var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var users = ss.getSheetByName('Users');
  var data = users.getDataRange().getValues();
  var name = email;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toLowerCase() === String(email).trim().toLowerCase()) {
      name = String(data[i][0]).trim();
      break;
    }
  }
  // Export Log columns: Timestamp, Name, Email, Tool, Export Type, Device ID, Config Snapshot
  log.appendRow([now, name, email, tool, exportType || '', deviceId || '', configSnapshot || '']);
  return {success: true, message: 'Export logged'};
}

function logSession(email, deviceId, duration) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName('Usage Log');
  var logData = log.getDataRange().getValues();
  for (var j = 1; j < logData.length; j++) {
    var rowEmail = String(logData[j][2]).trim();
    var rowDevice = String(logData[j][6] || '').trim();
    var rowPin = String(logData[j][3]).trim();
    if (rowEmail === email && rowDevice === deviceId && rowPin !== '') {
      log.getRange(j + 1, 6).setValue(duration);
      return {success: true, message: 'Session logged'};
    }
  }
  return {success: true, message: 'Session logged'};
}

function respond(result) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

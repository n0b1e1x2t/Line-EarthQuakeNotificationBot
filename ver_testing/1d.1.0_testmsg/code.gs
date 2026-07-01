const Meta_version = "1d.1.0_testmsg";
var Meta_debuggingMessageFeature = 1;
const Meta_updateDate = "2026/07/01";
const Meta_lineMessagingApi = "https://api.line.me/v2/bot/message/reply";

function debug_debugLog() {
  var doPost_replyText = JSON.parse(e.postData.contents).events[0];
  console.info("[Info]: debug_debugLog: System Version: " + Meta_version);
  readEarthquakeDataJson(2);
  console.log("Properties: LINE_ACCESS_TOKEN: " + PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN"));
}

function doPost(e) {
  var doPost_json = JSON.parse(e.postData.contents);
  var doPost_replytoken = doPost_json.events[0].replyToken;
  if (typeof doPost_replytoken === 'undefined') {
    return;
  }
  var doPost_message = doPost_json.events[0].message.text;
  switch (doPost_message) {
    case ("地震情報"):
      UrlFetchApp.fetch(Meta_lineMessagingApi, {
        'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN"),
        },
        'method': 'post',
        'payload': JSON.stringify({
          'replyToken': doPost_replytoken,
          'messages': [{
            'type': 'text',
            'text': readEarthquakeDataJson(1),
          }],
        }),
      });
      try {
        return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
      } catch (e) {
        throw new Error("doPost: Error: " + e);
      } finally {
        console.info("[Info]: doPost: Done.");
      }
    case ("debug: testmsg"):
      if (Meta_debuggingMessageFeature == 1) {
        UrlFetchApp.fetch(Meta_lineMessagingApi, {
          'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN"),
          },
          'method': 'post',
          'payload': JSON.stringify({
            'replyToken': doPost_replytoken,
            'messages': [{
              'type': 'text',
              'text': "Hello, World!",
            }],
          }),
        });
        try {
          return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
        } catch (e) {
          throw new Error("doPost: Error: " + e);
        } finally {
          console.info("[Info]: doPost: Done.");
        }
      } else {
        throw new Error("Meta_debuggingMessageFeature: The value of Meta_debuggingMessageFeature is invalid.");
      }
  }
}

function readEarthquakeDataJson(readEarthquakeDataJson_outPut) {
  let readEarthquakeDataJson_api = "https://api.p2pquake.net/v2/jma/quake?limit=1&order=-1";
  let readEarthquakeDataJson_maxScale = "";

  try {
    const readEarthquakeDataJson_response = UrlFetchApp.fetch(readEarthquakeDataJson_api).getContentText();
  } catch (e) {
    console.error("[Error]: readEarthquakeDataJson: Failed to retrieve the data. Error details: " + e);
    throw new Error("readEarthquakeDataJson: Failed to retrieve the data. Error details: " + e);
  }

  const readEarthquakeDataJson_response = UrlFetchApp.fetch(readEarthquakeDataJson_api).getContentText();
  let readEarthquakeDataJson_json = JSON.parse(readEarthquakeDataJson_response);
  if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] > 44) {
    if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 45) {
      readEarthquakeDataJson_maxScale = "5弱";
    } else {
      if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 50) {
        readEarthquakeDataJson_maxScale = "5強";
      } else {
        if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 55) {
          readEarthquakeDataJson_maxScale = "6弱";
        } else {
          if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 60) {
            readEarthquakeDataJson_maxScale = "6強";
          } else {
            if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 70) {
              readEarthquakeDataJson_maxScale = 7;
            }
          }
        }
      }
    }
  } else {
    if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 10) {
      readEarthquakeDataJson_maxScale = 1;
    } else {
      if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 20) {
        readEarthquakeDataJson_maxScale = 2;
      } else {
        if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 30) {
          readEarthquakeDataJson_maxScale = 3;
        } else {
          if (readEarthquakeDataJson_json[0]["earthquake"]["maxScale"] == 40) {
            readEarthquakeDataJson_maxScale = 4;
          }
        }
      }
    }
  }

  if (readEarthquakeDataJson_outPut == 1) {
    return "地震情報\n発生時間: " + readEarthquakeDataJson_json[0]["earthquake"]["time"] + "\n発生場所: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["name"] + "\n最大震度: " + readEarthquakeDataJson_maxScale + "\nマグニチュード: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["magnitude"] + "\n深さ: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["depth"];
  } else {
    // For Debug Only:
    if (readEarthquakeDataJson_outPut == 2) {
      console.log("[Debug]: readEarthquakeDataJson: Debugging Output");
      console.log("[Debug]: readEarthquakeDataJson: 場所(name): " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["name"]);
      console.log("[Debug]: readEarthquakeDataJson: 時間(time): " + readEarthquakeDataJson_json[0]["earthquake"]["time"]);
      console.log("[Debug]: readEarthquakeDataJson: 最大震度(maxScale): " + readEarthquakeDataJson_maxScale);
      console.log("[Debug]: readEarthquakeDataJson: 深さ(depth): " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["depth"]);
      console.log("[Debug]: readEarthquakeDataJson: マグニチュード(magnitude): " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["magnitude"]);
      console.log("[Debug]: readEarthquakeDataJson: 緯度(latitude): " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["latitude"]);
      console.log("[Debug]: readEarthquakeDataJson: 経度(longitude): " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["longitude"]);
      console.log("[Debug]: readEarthquakeDataJson: Message Templates: \n地震情報\n発生時間: " + readEarthquakeDataJson_json[0]["earthquake"]["time"] + "\n発生場所: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["name"] + "\n最大震度: " + readEarthquakeDataJson_maxScale + "\nマグニチュード: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["magnitude"] + "\n深さ: " + readEarthquakeDataJson_json[0]["earthquake"]["hypocenter"]["depth"]);
    } else {
      console.error("[Error]: readEarthquakeDataJson: The value of `readEarthquakeDataJson_outPut` is invalid.");
      throw new Error("readEarthquakeDataJson: The value of `readEarthquakeDataJson_outPut` is invalid.");
    }
  }
}


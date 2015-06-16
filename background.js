// Config context menus upon first install
chrome.runtime.onInstalled.addListener(function(request) {
	// Remove all the existing menu items (previous install maybe)
    chrome.contextMenus.removeAll();

    // Add the new menu items
    chrome.contextMenus.create({
		"id" : "autoLookup",
	    "title" : "Auto-Lookup Text",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupBTCAddress",
	    "title" : "Look Up Bitcoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "sendtoBTCAddress",
	    "title" : "Send To Bitcoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupLTCAddress",
	    "title" : "Look Up Litecoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "sendtoLTCAddress",
	    "title" : "Send To Litecoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupDOGEAddress",
	    "title" : "Look Up Dogecoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "sendtoDOGEAddress",
	    "title" : "Send To Dogecoin Address",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupBTCTX",
	    "title" : "Look Up Bitcoin TXID",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupLTCTX",
	    "title" : "Look Up Litecoin TXID",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupDOGETX",
	    "title" : "Look Up Dogecoin TXID",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
	chrome.contextMenus.create({
		"id" : "lookupBTCBlock",
	    "title" : "Look Up Bitcoin Block",
	    "type" : "normal",
	    "contexts" : ["selection"]
	});
});

// Set the event listener ONCE at the beginning
chrome.contextMenus.onClicked.addListener(contextClickHandler);

// Define what happens when the menu items are clicked
function contextClickHandler(info, tab) {
	var sText = info.selectionText.replace(/ /g,'');
	var itemID = info.menuItemId;
	var url = "http://example.com";
	var newtab = true;

	var explorerConfig = {
		"BTCAddress" : "https://blockchain.info/address/",
		"LTCAddress" : "https://block-explorer.com/address/",
		"DOGEAddress": "https://dogechain.info/address/",
		"BTCTX" : "https://blockchain.info/tx/",
		"LTCTX" : "https://block-explorer.com/tx/",
		"DOGETX": "https://dogechain.info/tx/",
		"BTCBlock" : "https://blockchain.info/block/"
	};
	var sendtoConfig = {
		"BTC":"bitcoin:",
		"LTC":"litecoin:",
		"DOGE":"dogecoin:"
	};

	// Set the URL based on the config and the type of click
	if (itemID.indexOf("lookup") > -1) {
		_.each(["Address","TX","Block"], function (textType) {
			if (itemID.indexOf(textType) > -1) {
				_.each(["BTC","LTC","DOGE"], function (coinType) {
					if (itemID.indexOf(coinType) > -1) {
						url = explorerConfig[coinType+textType];
					}
				});
			}
		});
	}
	else if (itemID.indexOf("sendto") > -1) {
		_.each(["BTC","LTC","DOGE"], function (coinType) {
			if (itemID.indexOf(coinType) > -1) {
				url = sendtoConfig[coinType];
				newtab = false;
			}
		});
	}
	else if (itemID == "autoLookup") {
		if(sText.replace(/ /g,'').match(/^[13][a-km-zA-HJ-NP-Z1-9]{26,33}$/)) {
	        // Bitcoin Address
	        url = explorerConfig["BTCAddress"];
	    }
	    else if(sText.replace(/ /g,'').match(/^L[a-km-zA-HJ-NP-Z1-9]{26,33}$/)) {
	    	// Litecoin Address
	    	url = explorerConfig["LTCAddress"];
	    }
	    else if(sText.replace(/ /g,'').match(/^D[a-km-zA-HJ-NP-Z1-9]{26,33}$/)) {
	    	// Dogecoin Address
	    	url = explorerConfig["DOGEAddress"];
	    }
	    else if(sText.replace(/ /g,'').match(/^[A-Fa-f0-9]{64}$/)) {
	    	// SHA256 Hash - Assuming TXID
	    	url = explorerConfig["BTCTX"];
	    }
	    else {
	        // Not a valid cryptocurrency address or tx format
	        alert("Please select a valid cryptocurrency-related string.");
	        return 0;
	    }
	}

	url += sText;
	//if (newtab) { window.open(url, newtab); }
	//else { window.location(url); }
	window.open(url, "_blank");
}